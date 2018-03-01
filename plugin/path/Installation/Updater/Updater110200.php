<?php

namespace Innova\PathBundle\Installation\Updater;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\InstallationBundle\Updater\Updater;
use Innova\PathBundle\Entity\SecondaryResource;

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

            if (!empty($activity)) {
                if (!empty($activity->getPrimaryResource())) {
                    $step->setResource($activity->getPrimaryResource());
                }
                $step->setTitle($activity->getResourceNode()->getName());
                $step->setDescription($activity->getDescription());

                $parameters = $activity->getParameters();

                if (!empty($parameters)) {
                    $order = 0;

                    foreach ($parameters->getSecondaryResources as $resource) {
                        $secondaryResource = new SecondaryResource();
                        $secondaryResource->setResource($resource);
                        $secondaryResource->setOrder($order);
                        $step->addSecondaryResource($secondaryResource);
                        $om->persist($secondaryResource);
                        ++$order;
                    }
                }
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