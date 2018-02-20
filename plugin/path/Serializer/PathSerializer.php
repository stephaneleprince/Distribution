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
            'id' => $path->getUuid(),
            'display' => [
                'description' => $path->getDescription(),
                'showOverview' => $path->getShowOverview(),
                'showSummary' => $path->getShowSummary(),
                'summaryDisplayed' => $path->isSummaryDisplayed(),
            ],
            'steps' => $this->serializeSteps($path),
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
        if (isset($data['display']['summaryDisplayed'])) {
            $path->setSummaryDisplayed($data['display']['summaryDisplayed']);
        }
        if (isset($data['steps'])) {
            $this->deserializeSteps($data['steps'], $path);
        }

        return $path;
    }

    /**
     * @param Path $path
     *
     * @return array
     */
    private function serializeSteps(Path $path)
    {
        $steps = [];

        foreach ($path->getSteps() as $step) {
            if (is_null($step->getParent())) {
                $steps[] = $this->serializeStep($step);
            }
        }

        return $steps;
    }

    /**
     * @param Step $step
     *
     * @return array
     */
    private function serializeStep(Step $step)
    {
        $serializedStep = [
            'id' => $step->getUuid(),
            'title' => $step->getTitle(),
            'description' => $step->getDescription(),
            'children' => [],
        ];

        foreach ($step->getChildren() as $child) {
            $serializedStep['children'][] = $this->serializeStep($child);
        }

        return $serializedStep;
    }

    /**
     * @param array $stepsData
     * @param Path  $path
     */
    private function deserializeSteps($stepsData, Path $path)
    {
        $path->emptySteps();
        $order = 0;

        foreach ($stepsData as $stepData) {
            $step = $this->deserializeStep($stepData, null, ['path' => $path, 'order' => $order]);
            $path->addStep($step);
            ++$order;
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
        if (isset($data['title'])) {
            $step->setTitle($data['title']);
        }
        if (isset($data['description'])) {
            $step->setDescription($data['description']);
        }
        $step->emptyChildren();

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
        if (isset($data['children'])) {
            $order = 0;

            foreach ($data['children'] as $childData) {
                $childOptions = [
                    'path' => $options['path'],
                    'parent' => $step,
                    'order' => $order,
                ];
                $child = $this->deserializeStep($childData, null, $childOptions);
                $step->addChild($child);
                ++$order;
            }
        }

        return $step;
    }
}
