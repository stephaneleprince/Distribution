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
            'parent' => $this->serializeParent($step),
            'children' => $this->serializeChildren($step),
        ];
    }

    /**
     * @param array $data
     * @param Step  $step
     *
     * @return Step
     */
    public function deserialize($data, Step $step)
    {
        $step->setUuid($data['id']);

        if (isset($data['lvl'])) {
            $step->setLvl($data['lvl']);
        }
        if (isset($data['order'])) {
            $step->setOrder($data['order']);
        }

        return $step;
    }

    private function serializeParent(Step $step)
    {
        $data = null;

        $parent = $step->getParent();

        if (!empty($parent)) {
            $data = [
              'id' => $parent->getUuid(),
            ];
        }

        return $data;
    }

    private function serializeChildren(Step $step)
    {
        $children = [];

        foreach ($step->getChildren() as $child) {
            $children[] = $this->serialize($child);
        }

        return $children;
    }
}
