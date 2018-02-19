<?php

namespace Innova\PathBundle\Serializer;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Persistence\ObjectManager;
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

    private $stepRepo;

    /**
     * PathSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->stepRepo = $om->getRepository('Innova\PathBundle\Entity\Step');
    }

    /**
     * @param Path $path
     *
     * @return array
     */
    public function serialize(Path $path)
    {
        return [
            'id' => $path->getId(),
            'name' => $path->getName(),
            'display' => [
                'description' => $path->getDescription(),
                'showOverview' => $path->getShowOverview(),
                'showSummary' => $path->getShowSummary(),
                'summaryDisplayed' => $path->isSummaryDisplayed(),
            ],
            'steps' => array_map(function (Step $step) {
                return $this->serializeStep($step);
            }, $path->getSteps()->toArray()),
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
        $path->setName($data['name']);
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
        if (isset($data['display']['summaryDisplayed'])) {
            $path->setSummaryDisplayed($data['display']['summaryDisplayed']);
        }
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
        return [
            'id' => $step->getId(),
            'children' => array_map(function (Step $child) {
                return $this->serialize($child);
            }, $step->getChildren()->toArray()),
        ];
    }

    /**
     * @param array $stepsData
     * @param Path  $path
     */
    private function deserializeSteps($stepsData, Path $path)
    {
        $path->emptySteps();

        foreach ($stepsData as $stepData) {
            $step = $this->deserializeStep($stepData, null, ['path' => $path]);
            $path->addStep($step);
        }
    }

    /**
     * @param array $data
     * @param Step  $step
     * @param array $options
     *
     * @return Step
     */
    private function deserializeStep($data, Step $step = null, array $options = [])
    {
        if (empty($step)) {
            $step = $this->stepRepo->findOneBy(['uuid' => $data['id']]);
        }
        if (empty($step)) {
            $step = new Step();
            $step->setUuid($data['id']);
        }
        $step->emptyChildren();

        if (isset($options['path'])) {
            $step->setPath($options['path']);
        }
        if (isset($data['children'])) {
            foreach ($data['children'] as $childData) {
                $childOptions = [
                    'path' => $options['path'],
                    'parent' => $step,
                ];
                $child = $this->deserializeStep($childData, null, $childOptions);
                $step->addChild($child);
            }
        }

        return $step;
    }
}
