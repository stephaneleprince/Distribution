<?php

namespace Innova\PathBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Innova\PathBundle\Entity\Path\Path;
use Innova\PathBundle\Entity\SecondaryResource;
use Innova\PathBundle\Entity\Step;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.path")
 * @DI\Tag("claroline.serializer")
 */
class PathSerializer
{
    use SerializerTrait;

    private $om;

    /** @var PublicFileSerializer */
    private $fileSerializer;

    /** @var ResourceNodeSerializer */
    private $resourceNodeSerializer;

    private $stepRepo;
    private $secondaryResourceRepo;
    private $resourceNodeRepo;

    /**
     * PathSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager"),
     *     "fileSerializer"     = @DI\Inject("claroline.serializer.public_file"),
     *     "resourceSerializer" = @DI\Inject("claroline.serializer.resource_node")
     * })
     *
     * @param ObjectManager          $om
     * @param PublicFileSerializer   $fileSerializer
     * @param ResourceNodeSerializer $resourceSerializer
     */
    public function __construct(
        ObjectManager $om,
        PublicFileSerializer $fileSerializer,
        ResourceNodeSerializer $resourceSerializer)
    {
        $this->om = $om;
        $this->fileSerializer = $fileSerializer;
        $this->resourceNodeSerializer = $resourceSerializer;
        $this->stepRepo = $om->getRepository('Innova\PathBundle\Entity\Step');
        $this->secondaryResourceRepo = $om->getRepository('Innova\PathBundle\Entity\SecondaryResource');
        $this->resourceNodeRepo = $om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceNode');
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/path/path.json';
    }

    /**
     * @param Path $path
     *
     * @return array
     */
    public function serialize(Path $path)
    {
        return [
            'id' => $path->getUuid(),
            'display' => [
                'description' => $path->getDescription(),
                'showOverview' => $path->getShowOverview(),
                'showSummary' => $path->getShowSummary(),
                'openSummary' => $path->isSummaryDisplayed(),
                'numbering' => $path->getNumbering() ? $path->getNumbering() : 'none',
            ],
            'steps' => array_map(function (Step $step) {
                return $this->serializeStep($step);
            }, $path->getRootSteps()),
        ];
    }

    /**
     * @param array $data
     * @param Path  $path
     *
     * @return Path
     */
    public function deserialize($data, Path $path)
    {
        $path->setUuid($data['id']);

        $this->sipe('display.description', 'setDescription', $data, $path);
        $this->sipe('display.showOverview', 'setShowOverview', $data, $path);
        $this->sipe('display.showSummary', 'setShowSummary', $data, $path);
        $this->sipe('display.openSummary', 'setSummaryDisplayed', $data, $path);
        $this->sipe('display.numbering', 'setNumbering', $data, $path);

        if (isset($data['steps'])) {
            $this->deserializeSteps($data['steps'], $path);
        }

        return $path;
    }

    /**
     * @param Step $step
     *
     * @return array
     */
    private function serializeStep(Step $step)
    {
        $poster = null;
        if (!empty($step->getPoster())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository('Claroline\CoreBundle\Entity\File\PublicFile')
                ->findOneBy(['url' => $step->getPoster()]);

            if ($file) {
                $poster = $this->fileSerializer->serialize($file);
            }
        }

        return [
            'id' => $step->getUuid(),
            'title' => $step->getTitle(),
            'description' => $step->getDescription(),
            'poster' => $poster,
            'primaryResource' => $step->getResource() ? $this->resourceNodeSerializer->serialize($step->getResource()) : null,
            'secondaryResources' => array_map(function (SecondaryResource $secondaryResource) {
                return $this->serializeSecondaryResource($secondaryResource);
            }, $step->getSecondaryResources()->toArray()),
            'display' => [
                'numbering' => $step->getNumbering(),
            ],
            'children' => array_map(function (Step $child) {
                return $this->serializeStep($child);
            }, $step->getChildren()->toArray()),
        ];
    }

    /**
     * @param SecondaryResource $secondaryResource
     *
     * @return array
     */
    private function serializeSecondaryResource(SecondaryResource $secondaryResource)
    {
        return [
            'id' => $secondaryResource->getUuid(),
            'inheritanceEnabled' => $secondaryResource->isInheritanceEnabled(),
            'resource' => $this->resourceNodeSerializer->serialize($secondaryResource->getResource()),
        ];
    }

    /**
     * @param array $stepsData
     * @param Path  $path
     */
    private function deserializeSteps($stepsData, Path $path)
    {
        $oldSteps = $path->getSteps()->toArray();
        $newStepsUuids = [];
        $path->emptySteps();
        $order = 0;

        foreach ($stepsData as $stepData) {
            $step = $this->deserializeStep($stepData, $newStepsUuids, ['path' => $path, 'order' => $order]);
            $path->addStep($step);
            ++$order;
        }
        /* Removes previous steps that are not used anymore */
        foreach ($oldSteps as $step) {
            if (!in_array($step->getUuid(), $newStepsUuids)) {
                $this->om->remove($step);
            }
        }
    }

    /**
     * @param array $data
     * @param array $newStepsUuids
     * @param array $options
     *
     * @return Step
     */
    private function deserializeStep($data, array &$newStepsUuids = [], array $options = [])
    {
        $newStepsUuids[] = $data['id'];
        $step = $this->stepRepo->findOneBy(['uuid' => $data['id']]);

        if (empty($step)) {
            $step = new Step();
            $step->setUuid($data['id']);
        }
        if (isset($data['title'])) {
            $step->setTitle($data['title']);
        }
        if (isset($data['description'])) {
            $step->setDescription($data['description']);
        }
        if (isset($data['poster'])) {
            $step->setPoster($data['poster']['url']);
        }

        if (isset($data['display']) && isset($data['display']['numbering'])) {
            $step->setNumbering($data['display']['numbering']);
        }

        /* Set primary resource */
        $resource = isset($data['primaryResource']['id']) ?
            $this->resourceNodeRepo->findOneBy(['guid' => $data['primaryResource']['id']]) :
            null;
        $step->setResource($resource);

        if (isset($options['path'])) {
            $step->setPath($options['path']);
        }
        if (isset($options['order'])) {
            $step->setOrder($options['order']);
        }
        if (isset($options['parent'])) {
            $step->setParent($options['parent']);
            $step->setLvl($options['parent']->getLvl() + 1);
        } else {
            $step->setLvl(0);
        }

        /* Set children steps */
        $step->emptyChildren();

        if (isset($data['children'])) {
            $order = 0;

            foreach ($data['children'] as $childData) {
                $childOptions = [
                    'path' => $options['path'],
                    'parent' => $step,
                    'order' => $order,
                ];
                $child = $this->deserializeStep($childData, $newStepsUuids, $childOptions);
                $step->addChild($child);
                ++$order;
            }
        }

        /* Set secondary resources */
        $oldSecondaryResources = $step->getSecondaryResources()->toArray();
        $newSecondaryResourcesUuids = [];
        $step->emptySecondaryResources();

        if (isset($data['secondaryResources'])) {
            $order = 0;

            foreach ($data['secondaryResources'] as $resourceData) {
                $resourceOptions = ['order' => $order];
                $secondaryResource = $this->deserializeSecondaryResource(
                    $resourceData,
                    $newSecondaryResourcesUuids,
                    $resourceOptions
                );
                $step->addSecondaryResource($secondaryResource);
                ++$order;
            }
        }
        /* Removes previous secondary resources that are not used anymore */
        foreach ($oldSecondaryResources as $secRes) {
            if (!in_array($secRes->getUuid(), $newSecondaryResourcesUuids)) {
                $this->om->remove($secRes);
            }
        }

        return $step;
    }

    /**
     * @param array $data
     * @param array $newSecondaryResourcesUuids
     * @param array $options
     *
     * @return SecondaryResource
     */
    private function deserializeSecondaryResource($data, array &$newSecondaryResourcesUuids = [], array $options = [])
    {
        $newSecondaryResourcesUuids[] = $data['id'];
        $secondaryResource = $this->secondaryResourceRepo->findOneBy(['uuid' => $data['id']]);

        if (empty($secondaryResource)) {
            $secondaryResource = new SecondaryResource();
            $secondaryResource->setUuid($data['id']);
        }
        $secondaryResource->setInheritanceEnabled($data['inheritanceEnabled']);

        /* Set resource */
        $resource = $this->resourceNodeRepo->findOneBy(['guid' => $data['resource']['id']]);
        $secondaryResource->setResource($resource);

        if (isset($options['order'])) {
            $secondaryResource->setOrder($options['order']);
        }

        return $secondaryResource;
    }
}
