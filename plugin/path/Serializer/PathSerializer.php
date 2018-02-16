<?php

namespace Innova\PathBundle\Serializer;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
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

    private $stepSerializer;

    /**
     * PathSerializer constructor.
     *
     * @DI\InjectParams({
     *     "stepSerializer" = @DI\Inject("claroline.serializer.path.step")
     * })
     *
     * @param StepSerializer $stepSerializer
     */
    public function __construct(StepSerializer $stepSerializer)
    {
        $this->stepSerializer = $stepSerializer;
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
            'structure' => $path->getStructure(),
            'modified' => $path->isModified(),
            'display' => [
                'description' => $path->getDescription(),
                'showOverview' => $path->getShowOverview(),
                'showSummary' => $path->getShowSummary(),
                'summaryDisplayed' => $path->isSummaryDisplayed(),
            ],
            'steps' => array_map(function (Step $step) {
                return $this->stepSerializer->serialize($step);
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

        if (isset($data['structure'])) {
            $path->setStructure($data['structure']);
        }
        if (isset($data['modified'])) {
            $path->setModified($data['modified']);
        }
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
     * @param array $stepsData
     * @param Path  $path
     */
    private function deserializeSteps($stepsData, Path $path)
    {
        $path->emptySteps();

        foreach ($stepsData as $stepData) {
            $step = $this->stepSerializer->deserialize($stepData, null, ['path' => $path]);
            $path->addStep($step);
        }
    }
}
