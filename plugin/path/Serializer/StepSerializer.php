<?php

namespace Innova\PathBundle\Serializer;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Innova\PathBundle\Entity\Step;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.path.step")
 * @DI\Tag("claroline.serializer")
 */
class StepSerializer
{
    use SerializerTrait;

    private $stepRepo;

    /**
     * StepSerializer constructor.
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
     * @param Step $step
     *
     * @return array
     */
    public function serialize(Step $step)
    {
        return [
            'id' => $step->getId(),
            'lvl' => $step->getLvl(),
            'order' => $step->getOrder(),
            'parent' => $step->getParent() ? [
                'id' => $step->getParent()->getUuid(),
            ] : null,
            'children' => array_map(function (Step $child) {
                return $this->serialize($child);
            }, $step->getChildren()->toArray()),
        ];
    }

    /**
     * @param array $data
     * @param Step  $step
     * @param array $options
     *
     * @return Step
     */
    public function deserialize($data, Step $step = null, array $options = [])
    {
        if (empty($step)) {
            $step = $this->stepRepo->findOneBy(['uuid' => $data['id']]);
        }
        if (empty($step)) {
            $step = new Step();
            $step->setUuid($data['id']);
        }
        $step->emptyChildren();

        if (isset($data['order'])) {
            $step->setOrder($data['order']);
        }
        if (isset($options['parent'])) {
            $step->setParent($options['parent']);
        }
        if (isset($options['path'])) {
            $step->setPath($options['path']);
        }
        if (isset($data['children'])) {
            foreach ($data['children'] as $childData) {
                $childOptions = [
                    'path' => $options['path'],
                    'parent' => $step,
                ];
                $child = $this->deserialize($childData, null, $childOptions);
                $step->addChild($child);
            }
        }

        return $step;
    }
}
