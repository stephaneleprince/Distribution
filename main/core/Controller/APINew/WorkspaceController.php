<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Controller\APINew\Model\HasGroupsTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasOrganizationsTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasRolesTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasUsersTrait;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\Workspace\Workspace", ignore={})
 * @Route("/workspace")
 */
class WorkspaceController extends AbstractCrudController
{
    use HasOrganizationsTrait;
    use HasRolesTrait;
    use HasUsersTrait;
    use HasGroupsTrait;

    public function getName()
    {
        return 'workspace';
    }

    public function copyBulkAction(Request $request, $class)
    {
        //add params for the copy here
        $this->options['copyBulk'] = 1 === (int) $request->query->get('model') || 'true' === $request->query->get('model') ?
          [Options::WORKSPACE_MODEL] : [];

        return parent::copyBulkAction($request, $class);
    }

    /**
     * @Route(
     *    "/{id}/pending",
     *    name="apiv2_workspace_list_pending"
     * )
     * @Method("GET")
     * @ParamConverter("workspace", options={"mapping": {"id": "uuid"}})
     *
     * @param Workspace $workspace
     *
     * @return JsonResponse
     */
    public function pendingListAction(Request $request, Workspace $workspace)
    {
        return new JsonResponse($this->finder->search(
            'Claroline\CoreBundle\Entity\Workspace\WorkspaceRegistrationQueue',
            ['hiddenFilters' => ['workspace' => $workspace->getUuid()]]
        ));
    }

    /**
     * @Route(
     *    "/{id}/registration/validate",
     *    name="apiv2_workspace_registration_validate"
     * )
     * @Method("PATCH")
     * @ParamConverter("workspace", options={"mapping": {"id": "uuid"}})
     *
     * @param Workspace $workspace
     *
     * @return JsonResponse
     */
    public function validateRegistrationAction(Request $request, Workspace $workspace)
    {
        $query = $request->query->all();
        $users = $this->om->findList('Claroline\CoreBundle\Entity\User', 'uuid', $query['ids']);

        foreach ($users as $user) {
            $pending = $this->om->getRepository('Claroline\CoreBundle\Entity\Workspace\WorkspaceRegistrationQueue')
              ->findOneBy(['user' => $user, 'workspace' => $workspace]);
            //maybe use the crud instead ? I don't know yet
            $this->container->get('claroline.manager.workspace_user_queue_manager')->validateRegistration($pending);
            $this->container->get('claroline.manager.workspace_user_queue_manager')->removeRegistrationQueue($pending);
        }

        return new JsonResponse($this->finder->search(
            'Claroline\CoreBundle\Entity\Workspace\WorkspaceRegistrationQueue',
            ['hiddenFilters' => ['workspace' => $workspace->getUuid()]]
        ));
    }

    /**
     * @Route(
     *    "/{id}/users/unregistrate",
     *    name="apiv2_workspace_unregister_users"
     * )
     * @Method("DELETE")
     * @ParamConverter("workspace", options={"mapping": {"id": "uuid"}})
     *
     * @param Workspace $workspace
     *
     * @return JsonResponse
     */
    public function unregisterUsersAction(Request $request, Workspace $workspace)
    {
        $query = $request->query->all();
        $users = $this->om->findList('Claroline\CoreBundle\Entity\User', 'uuid', $query['ids']);

        $this->om->startFlushSuite();

        foreach ($users as $user) {
            $this->container->get('claroline.manager.workspace_manager')->unregister($user, $workspace);
        }

        $this->om->endFlushSuite();

        return new JsonResponse('success');
    }

    /**
     * @Route(
     *    "/{id}/groups/unregistrate",
     *    name="apiv2_workspace_unregister_groups"
     * )
     * @Method("DELETE")
     * @ParamConverter("workspace", options={"mapping": {"id": "uuid"}})
     *
     * @param Workspace $workspace
     *
     * @return JsonResponse
     */
    public function unregisterGroupsAction(Request $request, Workspace $workspace)
    {
        $query = $request->query->all();
        $groups = $this->om->findList('Claroline\CoreBundle\Entity\Group', 'uuid', $query['ids']);

        $this->om->startFlushSuite();

        foreach ($groups as $group) {
            $this->container->get('claroline.manager.workspace_manager')->unregister($group, $workspace);
        }

        $this->om->endFlushSuite();

        return new JsonResponse('success');
    }

    /**
     * @Route(
     *    "/{id}/managers",
     *    name="apiv2_workspace_list_managers"
     * )
     * @Method("GET")
     * @ParamConverter("workspace", options={"mapping": {"id": "uuid"}})
     *
     * @param Workspace $workspace
     *
     * @return JsonResponse
     */
    public function listManagersAction(Workspace $workspace)
    {
        $role = $this->container->get('claroline.manager.role_manager')->getManagerRole($workspace);

        return new JsonResponse($this->finder->search(
            'Claroline\CoreBundle\Entity\User',
            ['hiddenFilters' => ['role' => $role->getUuid()]],
            [Options::IS_RECURSIVE]
        ));
    }
}
