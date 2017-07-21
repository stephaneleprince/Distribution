<?php

namespace Icap\BlogBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Icap\BlogBundle\Repository\CommentRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;

/**
 * @DI\Service("icap.blog.manager.comment")
 */
class CommentManager
{
    /**
     * @var ObjectManager
     */
    protected $om;

    /** @var \Icap\BlogBundle\Repository\CommentRepository */
    protected $repo;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager"),
     *     "repo" = @DI\Inject("icap.blog.comment_repository")
     * })
     */
    public function __construct(ObjectManager $om, CommentRepository $repo)
    {
        $this->om = $om;
        $this->repo = $repo;
    }

    public function replaceAuthor(User $from, User $to)
    {
        $posts = $this->repo->findByAuthor($from);

        foreach($posts as $post) {
            $post->setAuthor($to);
        }

        $this->om->flush();

        return count($posts);
    }
}
