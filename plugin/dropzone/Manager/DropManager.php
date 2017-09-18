<?php

namespace Icap\DropzoneBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\ORM\EntityManager;
use Icap\DropzoneBundle\Repository\DropRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.manager.drop_manager")
 */
class DropManager
{
    /** @var DropRepository  */
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
        $this->repository = $em->getRepository('IcapDropzoneBundle:Drop');
    }

    /**
     * Replace user in a drop
     *
     * @param User $from
     * @param User $to
     *
     * @return integer
     */
    public function replaceUser(User $from, User $to) {

        $drops = $this->repository->findByUser($from);

        foreach($drops as $drop) {
            $drop->setCreator($to);
        }

        $this->om->flush();

        return count($drops);
    }
}
