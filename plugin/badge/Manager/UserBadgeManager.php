<?php

namespace Icap\BadgeBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\ORM\EntityManager;
use Icap\BadgeBundle\Repository\UserBadgeRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.manager.user_badge_manager")
 */
class UserBadgeManager
{
    /** @var UserBadgeRepository  */
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
        $this->repository = $em->getRepository('IcapBadgeBundle:UserBadge');
    }

    /**
     * Replace user in a userBadge association
     *
     * @param User $from
     * @param User $to
     *
     * @return integer
     */
    public function replaceUser(User $from, User $to) {

        $userBadges = $this->repository->findByUser($from);

        foreach($userBadges as $userBadge) {
            $userBadge->setUser($to);
        }

        $this->om->flush();

        return count($userBadges);
    }
}
