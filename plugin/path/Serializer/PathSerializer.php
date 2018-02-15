<?php

namespace Innova\PathBundle\Serializer;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Innova\PathBundle\Entity\Path\Path;
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
            'description' => $path->getDescription(),
            'showOverview' => $path->getShowOverview(),
            'summaryDisplayed' => $path->isSummaryDisplayed(),
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
        $path->setName($data['name']);
        $path->setUuid($data['id']);

        if (isset($data['structure'])) {
            $path->setStructure($data['structure']);
        }
        if (isset($data['modified'])) {
            $path->setModified($data['modified']);
        }
        if (isset($data['description'])) {
            $path->setDescription($data['description']);
        }
        if (isset($data['showOverview'])) {
            $path->setShowOverview($data['showOverview']);
        }
        if (isset($data['summaryDisplayed'])) {
            $path->setSummaryDisplayed($data['summaryDisplayed']);
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
            $steps[] = $this->stepSerializer->serialize($step);
        }

        return $steps;
    }

    /**
     * @param array $stepsData
     * @param Path  $path
     */
    private function deserializeSteps($stepsData, Path $path)
    {
        $path->emptySteps();

        foreach ($stepsData as $stepData) {
            $step = $this->stepSerializer->deserialize($stepData, $path);
            $path->addStep($step);
        }
    }
}
