<?php

namespace Icap\BadgeBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\ORM\EntityManager;
use Icap\BadgeBundle\Repository\BadgeCollectionRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.manager.badge_collection_manager")
 */
class BadgeCollectionManager
{
    /** @var BadgeCollectionRepository  */
    private $repository;

    /** @var ObjectManager  */
    private $om;

    /**
     * @DI\InjectParams({
     *     "em" = @DI\Inject("doctrine.orm.entity_manager"),
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(EntityManager $em, ObjectManager $om)
    {
        $this->om = $om;
        $this->repository = $em->getRepository('IcapBadgeBundle:BadgeCollection');
    }

    /**
     * Replace user in a badge collection
     *
     * @param User $from
     * @param User $to
     *
     * @return integer
     */
    public function replaceUser(User $from, User $to) {

        $badgeCollections = $this->repository->findByUser($from);

        foreach($badgeCollections as $badgeCollection) {
            $badgeCollection->setUser($to);
        }

        $this->om->flush();

        return count($badgeCollections);
    }
}
