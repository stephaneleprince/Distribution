<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Repository;

use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\QueryBuilder;
use Gedmo\Tree\Entity\Repository\MaterializedPathRepository;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Repository\Exception\UnknownFilterException;

/**
 * Repository for AbstractResource entities. The methods of this class may return
 * entities either as objects or as as arrays (see their respective documentation).
 */
class ResourceNodeRepository extends MaterializedPathRepository
{
    /**
     * Returns the root directory of a workspace.
     *
     * @param Workspace $workspace
     *
     * @return ResourceNode
     */
    public function findWorkspaceRoot(Workspace $workspace)
    {
        $builder = new ResourceQueryBuilder();
        $builder->selectAsEntity()
            ->whereInWorkspace($workspace)
            ->whereParentIsNull();
        $query = $this->_em->createQuery($builder->getDql());
        $query->setParameters($builder->getParameters());

        return $query->getOneOrNullResult();
    }

    /**
     * Returns the descendants of a resource.
     *
     * @param ResourceNode $resource           The resource node to start with
     * @param boolean      $includeStartNode   Whether the given resource should be included in the result
     * @param string       $filterResourceType A resource type to filter the results
     *
     * @return array[ResourceNode]
     */
    public function findDescendants(
        ResourceNode $resource,
        $includeStartNode = false,
        $filterResourceType = null
    )
    {
        $builder = new ResourceQueryBuilder();
        $builder->selectAsEntity(true)
            ->wherePathLike($resource->getPath(), $includeStartNode);

        if ($filterResourceType) {
            $builder->whereTypeIn(array($filterResourceType));
        }

        $query = $this->_em->createQuery($builder->getDql());
        $query->setParameters($builder->getParameters());

        return $this->executeQuery($query, null, null, false);
    }

    /**
     * Returns the immediate children of a resource that are openable by any of the given roles.
     *
     * @param ResourceNode $parent The id of the parent of the requested children
     * @param array $roles [string] $roles  An array of roles
     *
     * @throws \RuntimeException
     * @throw InvalidArgumentException if the array of roles is empty
     *
     * @return array[array] An array of resources represented as arrays
     */
    public function findChildren(ResourceNode $parent, array $roles)
    {
        if (count($roles) === 0) {
            throw new \RuntimeException('Roles cannot be empty');
        }

        $builder = new ResourceQueryBuilder();
        $children = array();

        //check if manager of the workspace.
        //if it's true, show every children
        if ($this->isWorkspaceManager($parent, $roles)) {
            $builder->selectAsArray()
                ->whereParentIs($parent)
                ->orderByName();
            $query = $this->_em->createQuery($builder->getDql());
            $query->setParameters($builder->getParameters());
            $items = $query->iterate(null, AbstractQuery::HYDRATE_ARRAY);

            foreach ($items as $key => $item) {
                $item[$key]['mask'] = 65535;
                $children[] = $item[$key];
            }

            return $children;

        //otherwise only show visible children
        } else {
            $builder->selectAsArray(true)
                ->whereParentIs($parent)
                ->whereHasRoleIn($roles);

            $query = $this->_em->createQuery($builder->getDql());
            $query->setParameters($builder->getParameters());

            $children = $this->executeQuery($query);
            $childrenWithMaxRights = array();

            foreach ($children as $child) {
                if (!isset($childrenWithMaxRights[$child['id']])) {
                    $childrenWithMaxRights[$child['id']] = $child;
                }

                foreach ($childrenWithMaxRights as $id => $childMaxRights) {
                    if ($id === $child['id']) {
                        $childrenWithMaxRights[$id]['mask'] |= $child['mask'];
                    }
                }
            }

            $returnedArray = array();

            foreach ($childrenWithMaxRights as $childMaxRights) {
                $returnedArray[] = $childMaxRights;
            }

            return $returnedArray;
        }
   }

    /**
     * Returns the root directories of workspaces a user is registered to.
     *
     * @param User $user
     *
     * @return array[array] An array of resources represented as arrays
     */
    public function findWorkspaceRootsByUser(User $user)
    {
        $builder = new ResourceQueryBuilder();
        $dql = $builder->selectAsArray()
            ->whereParentIsNull()
            ->whereInUserWorkspace($user)
            ->orderByPath()
            ->getDql();
        $query = $this->_em->createQuery($dql);
        $query->setParameters($builder->getParameters());

        return $this->executeQuery($query);
    }

    /**
     * Returns the roots directories a user is granted access
     *
     * @param array $roles
     *
     * @return array[array] An array of resources represented as arrays
     */
    public function findWorkspaceRootsByRoles(array $roles)
    {
        $builder = new ResourceQueryBuilder();
        $dql = $builder->selectAsArray()
            ->whereParentIsNull()
            ->whereHasRoleIn($roles)
            ->orderByName()
            ->getDql();

        $query = $this->_em->createQuery($dql);
        $query->setParameters($builder->getParameters());

        return $this->executeQuery($query);
    }

    /**
     * Returns the ancestors of a resource, including the resource itself.
     *
     * @param ResourceNode $resource
     *
     * @return array[array] An array of resources represented as arrays
     */
    public function findAncestors(ResourceNode $resource)
    {
        // No need to access DB to get ancestors as they are given by the materialized path.
        $regex = '/-(\d+)' . ResourceNode::PATH_SEPARATOR . '/';
        $parts = preg_split($regex, $resource->getPath(), -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
        $ancestors = array();
        $currentPath = '';

        for ($i = 0, $count = count($parts); $i < $count; $i += 2) {
            $ancestor = array();
            $currentPath = $currentPath . $parts[$i] . '-' . $parts[$i + 1] . '`';
            $ancestor['path'] = $currentPath;
            $ancestor['name'] = $parts[$i];
            $ancestor['id'] = (int) $parts[$i + 1];
            $ancestors[] = $ancestor;
        }

        return $ancestors;
    }

    /**
     * Returns the resources matching a set of given criterias. If an array
     * of roles is passed, only the resources that can be opended by any of
     * these roles are matched.
     * WARNING: the recursive search is far from being optimized.
     *
     * @param array   $criteria    An array of search filters
     * @param array   $roles       An array of user's roles
     * @param boolean $isRecursive Will the search follow links.
     *
     * @return array[array] An array of resources represented as arrays
     */
    public function findByCriteria(array $criteria, array $roles = null, $isRecursive = false)
    {
        $builder = new ResourceQueryBuilder();
        $builder->selectAsArray();

        if ($isRecursive) {
            $shortcuts = $this->findRecursiveDirectoryShortcuts($criteria, $roles);
            $additionnalRoots = array();

            foreach ($shortcuts as $shortcut) {
                $additionnalRoots[] = $shortcut['target_path'];
            }

            $baseRoots = (count($criteria['roots']) > 0) ?
                $criteria['roots']: array();
            $finalRoots = array_merge($additionnalRoots, $baseRoots);
            $criteria['roots'] = $finalRoots;
        }

        $this->addFilters($builder, $criteria, $roles);
        $dql = $builder->orderByPath()->getDql();
        $query = $this->_em->createQuery($dql);
        $query->setParameters($builder->getParameters());
        $resources = $query->getResult();

        return $resources;
    }

    /**
     * Returns an array of different file types with the number of resources that
     * belong to this type.
     *
     * @param integer $max
     *
     * @return array
     */
    public function findMimeTypesWithMostResources($max)
    {
        $qb = $this->createQueryBuilder('resource');
        $qb->select('resource.mimeType AS type, COUNT(resource.id) AS total')
            ->where($qb->expr()->isNotNull('resource.mimeType'))
            ->groupBy('resource.mimeType')
            ->orderBy('total', 'DESC');

        if ($max > 1) {
            $qb->setMaxResults($max);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Returns the workspace name and code of the resources whose ids are passed
     * as argument.
     *
     * @param array $resourceIds
     *
     * @return array
     *
     * @throws \InvalidArgumentException if the resource ids array is empty
     */
    public function findWorkspaceInfoByIds(array $nodesIds)
    {
        if (count($nodesIds) === 0) {
            throw new \InvalidArgumentException('Resource ids array cannot be empty');
        }

        $dql = '
            SELECT r.id AS id, w.code AS code, w.name AS name
            FROM Claroline\CoreBundle\Entity\Resource\ResourceNode r
            JOIN r.workspace w
            WHERE r.id IN (:nodeIds)
            ORDER BY w.name ASC
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('nodeIds', $nodesIds);

        return $query->getResult();
    }

    /**
     * Returns all the shortcuts targeting a directory (recursive).
     *
     * @param array $criteria
     * @param array $roles
     *
     * @return array[array] An array of resources represented as arrays
     *
     * @todo find a proper way to prevent infinite recursion
     */
    public function findRecursiveDirectoryShortcuts(array $criteria, array $roles = null, $alreadyFound = array())
    {
        $builder = new ResourceQueryBuilder();
        $builder->selectAsArray();
        $this->addFilters($builder, $criteria, $roles);
        $dql = $builder->whereIsShortcut()->getDql();
        $query = $this->_em->createQuery($dql);
        $query->setParameters($builder->getParameters());
        $results = $query->getResult();

        foreach ($results as $result) {
            $criteria['roots'] = array($result['target_path']);
            //if the result was already found, stop the recursion.
            if (!in_array($result, $alreadyFound)) {
                $results = array_merge($this->findRecursiveDirectoryShortcuts($criteria, $roles, $results), $results);
                $results = array_map('unserialize', array_unique(array_map('serialize', $results)));
            }
        }

        return $results;
    }

    public function findByMimeTypeAndParent($mimeType, ResourceNode $parent, array $roles)
    {
        $builder = new ResourceQueryBuilder();
        if (!$this->isWorkspaceManager($parent, $roles)) {
            $dql = $builder->selectAsEntity(false, 'Claroline\CoreBundle\Entity\Resource\File')
                ->whereParentIs($parent)
                ->whereMimeTypeIs('%'.$mimeType.'%')
                ->whereHasRoleIn($roles)
                ->getDql();
        } else {
            $dql = $builder->selectAsEntity(false, 'Claroline\CoreBundle\Entity\Resource\File')
                ->whereParentIs($parent)
                ->whereMimeTypeIs('%'.$mimeType.'%')
                ->whereCanOpen()
                ->getDql();
        }

        $query = $this->_em->createQuery($dql);
        $query->setParameters($builder->getParameters());
        $resources = $query->getResult();

        return $resources;
    }

    public function findByWorkspaceAndResourceType(Workspace $workspace, ResourceType $resourceType)
    {
        $qb = $this->createQueryBuilder('resourceNode');
        $qb->select('resourceNode')
            ->where('resourceNode.workspace = :workspace')
            ->andWhere('resourceNode.resourceType = :resourceType');

        return $results = $qb->getQuery()->execute(
            array(
                ':workspace'    => $workspace,
                ':resourceType' => $resourceType
            )
        );
    }

    /**
     * @param string $name
     * @param array  $extraDatas
     * @param bool   $executeQuery
     *
     * @return QueryBuilder|array
     */
    public function findByName($name, $extraDatas = array(), $executeQuery = true)
    {
        $name  = strtoupper($name);
        /** @var \Doctrine\ORM\QueryBuilder $queryBuilder */
        $queryBuilder = $this->createQueryBuilder('resourceNode');
        $queryBuilder->where($queryBuilder->expr()->like('UPPER(resourceNode.name)', ':name'));

        if (0 < count($extraDatas)) {
            foreach ($extraDatas as $key => $extraData) {
                $queryBuilder
                    ->andWhere(sprintf('resourceNode.%s = :%s', $key, $key))
                    ->setParameter(sprintf(':%s', $key), $extraData);
            }
        }

        $queryBuilder
            ->orderBy('resourceNode.name', 'ASC')
            ->setParameter(':name', "%{$name}%");

        return $executeQuery ? $queryBuilder->getQuery()->getResult(): $queryBuilder;
    }

    /**
     * @param string $search
     * @param array  $extraData
     *
     * @return array
     */
    public function findByNameForAjax($search, $extraData)
    {
        $resultArray = array();

        /** @var ResourceNode[] $resourceNodes */
        $resourceNodes = $this->findByName($search, $extraData);

        foreach ($resourceNodes as $resourceNode) {
            $resultArray[] = array(
                'id'   => $resourceNode->getId(),
                'text' => $resourceNode->getPathForDisplay()
            );
        }

        return $resultArray;
    }

    private function addFilters(ResourceQueryBuilder $builder,  array $criteria, array $roles = null)
    {
        if ($roles) {
            $builder->whereHasRoleIn($roles);
        }

        $filterMethodMap = array(
            'types' => 'whereTypeIn',
            'roots' => 'whereRootIn',
            'dateFrom' => 'whereDateFrom',
            'dateTo' => 'whereDateTo',
            'name' => 'whereNameLike',
            'isExportable' => 'whereIsExportable'
        );
        $allowedFilters = array_keys($filterMethodMap);

        foreach ($criteria as $filter => $value) {
            if ($value !== null) {
                if (in_array($filter, $allowedFilters)) {
                    $builder->{$filterMethodMap[$filter]}($value);
                } else {
                    throw new UnknownFilterException("Unknown filter '{$filter}'");
                }
            }
        }

        return $builder;
    }

    /**
     * Executes a DQL query and returns resources as entities or arrays.
     * If it returns arrays, it add a "pathfordisplay" field to each item.
     *
     * @param Query   $query   The query to execute
     * @param integer $offset  First row to start with
     * @param integer $numrows Maximum number of rows to return
     * @param boolean $asArray Whether the resources must be returned as arrays or as objects
     *
     * @return array[AbstractResource|array]
     */
    private function executeQuery($query, $offset = null, $numrows = null, $asArray = true)
    {
        $query->setFirstResult($offset);
        $query->setMaxResults($numrows);

        if ($asArray) {
            $resources = $query->getArrayResult();
            $return = $resources;
            // Add a field "pathfordisplay" in each entity (as array) of the given array.
            foreach ($resources as $key => $resource) {

                if (isset($resource['path'])) {
                    $return[$key]['path_for_display'] = ResourceNode::convertPathForDisplay($resource['path']);

                }
            }

            return $return;
        }

        return $query->getResult();
    }

    private function isWorkspaceManager(ResourceNode $node, array $roles)
    {
        $rolenames = array();

        foreach ($roles as $role) {
            if ($role instanceof \Symfony\Component\Security\Core\Role\Role) {
                $rolenames[] = $role->getRole();
            } else {
                $rolenames[] = $role;
            }
        }

        $isWorkspaceManager = false;
        $ws = $node->getWorkspace();
        $managerRole = 'ROLE_WS_MANAGER_' . $ws->getGuid();

        if (in_array($managerRole, $rolenames)) {
            $isWorkspaceManager = true;
        }

        if (in_array('ROLE_ADMIN', $rolenames)) {
            $isWorkspaceManager = true;
        }

        return $isWorkspaceManager;
    }
}
