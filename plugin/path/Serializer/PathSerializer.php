<?php

namespace Innova\PathBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Innova\PathBundle\Entity\Path\Path;
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
    private $resourceNodeSerializer;

    private $stepRepo;
    private $resourceNodeRepo;

    /**
     * PathSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager"),
     *     "resourceSerializer" = @DI\Inject("claroline.serializer.resource_node")
     * })
     *
     * @param ObjectManager          $om
     * @param ResourceNodeSerializer $resourceSerializer
     */
    public function __construct(ObjectManager $om, ResourceNodeSerializer $resourceSerializer)
    {
        $this->om = $om;
        $this->resourceNodeSerializer = $resourceSerializer;
        $this->stepRepo = $om->getRepository('Innova\PathBundle\Entity\Step');
        $this->resourceNodeRepo = $om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceNode');
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
                'numbering' => $path->getNumbering(),
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

        if (isset($data['display']['description'])) {
            $path->setDescription($data['display']['description']);
        }
        if (isset($data['display']['showOverview'])) {
            $path->setShowOverview($data['display']['showOverview']);
        }
        if (isset($data['display']['showSummary'])) {
            $path->setShowSummary($data['display']['showSummary']);
        }
        if (isset($data['display']['openSummary'])) {
            $path->setSummaryDisplayed($data['display']['openSummary']);
        }
        if (isset($data['display']['numbering'])) {
            $path->setNumbering($data['display']['numbering']);
        }
        if (isset($data['steps'])) {
            $this->deserializeSteps($data['steps'], $path);
        }

        return $path;
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/path/path.json';
    }

    /**
     * @param Step $step
     *
     * @return array
     */
    private function serializeStep(Step $step)
    {
        return [
            'id' => $step->getUuid(),
            'title' => $step->getTitle(),
            'description' => $step->getDescription(),
            'resource' => $step->getResource() ? $this->resourceNodeSerializer->serialize($step->getResource()) : null,
            'children' => array_map(function (Step $child) {
                return $this->serializeStep($child);
            }, $step->getChildren()->toArray()),
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
            $step = $this->deserializeStep($stepData, null, $newStepsUuids, ['path' => $path, 'order' => $order]);
            $path->addStep($step);
            ++$order;
        }
        foreach ($oldSteps as $step) {
            if (!in_array($step->getUuid(), $newStepsUuids)) {
                $this->om->remove($step);
            }
        }
    }

    /**
     * @param array $data
     * @param Step  $step
     * @param array $newStepsUuids
     * @param array $options
     *
     * @return Step
     */
    private function deserializeStep($data, Step $step = null, array &$newStepsUuids, array $options = [])
    {
        $newStepsUuids[] = $data['id'];

        if (empty($step)) {
            $step = $this->stepRepo->findOneBy(['uuid' => $data['id']]);
        }
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
        /* Set primary resource */
        $resource = isset($data['resource']['id']) ?
            $this->resourceNodeRepo->findOneBy(['guid' => $data['resource']['id']]) :
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
                $child = $this->deserializeStep($childData, null, $newStepsUuids, $childOptions);
                $step->addChild($child);
                ++$order;
            }
        }

        return $step;
    }
}
