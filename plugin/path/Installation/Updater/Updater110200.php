<?php

namespace Innova\PathBundle\Installation\Updater;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\InstallationBundle\Updater\Updater;

class Updater110200 extends Updater
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    /**
     * Initializes Steps resource node from activity resource.
     */
    public function postUpdate()
    {
        /** @var ObjectManager $om */
        $om = $this->container->get('claroline.persistence.object_manager');

        $steps = $om->getRepository('Innova\PathBundle\Entity\Step')->findAll();

        $this->log('Initializing resource node of steps...');

        $om->startFlushSuite();
        $i = 0;

        foreach ($steps as $step) {
            $activity = $step->getActivity();

            if (!empty($activity) && !empty($activity->getPrimaryResource())) {
                $step->setResource($activity->getPrimaryResource());
                $om->persist($step);
            }
            ++$i;

            if ($i % 250 === 0) {
                $om->forceFlush();
            }
        }

        $om->endFlushSuite();
    }
}
