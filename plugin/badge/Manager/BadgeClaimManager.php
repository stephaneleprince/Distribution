<?php

namespace Icap\BadgeBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\ORM\EntityManager;
use Icap\BadgeBundle\Repository\BadgeClaimRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap_badge.manager.badge_claim")
 */
class BadgeClaimManager
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected $entityManager;

    /** @var  BadgeClaimRepository */
    protected $repository;

    /** @var ObjectManager  */
    private $om;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "entityManager"   = @DI\Inject("doctrine.orm.entity_manager"),
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(EntityManager $entityManager, ObjectManager $om)
    {
        $this->entityManager = $entityManager;
        $this->repository = $entityManager->getRepository('IcapBadgeBundle:BadgeClaim');
        $this->om = $om;
    }

    /**
     * @param User $user
     *
     * @return \Icap\BadgeBundle\Entity\BadgeClaim[]
     */
    public function getByUser(User $user)
    {
        /** @var \Icap\BadgeBundle\Entity\BadgeClaim[] $claimedBadges */
        $claimedBadges = [];

        /** @var \Icap\BadgeBundle\Entity\BadgeClaim[] $badgeClaims */
        $badgeClaims = $this->entityManager->getRepository('IcapBadgeBundle:BadgeClaim')->findByUser($user);

        foreach ($badgeClaims as $badgeClaim) {
            $claimedBadges[$badgeClaim->getBadge()->getId()] = $badgeClaim;
        }

        return $claimedBadges;
    }

    /**
     * Replace user in a badge claim
     *
     * @param User $from
     * @param User $to
     *
     * @return integer
     */
    public function replaceUser(User $from, User $to) {

        $badgeClaims = $this->repository->findByUser($from);

        foreach($badgeClaims as $badgeClaim) {
            $badgeClaim->setUser($to);
        }

        $this->om->flush();

        return count($badgeClaims);
    }
}
