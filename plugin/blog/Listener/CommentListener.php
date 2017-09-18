<?php

/*
* This file is part of the Claroline Connect package.
*
* (c) Claroline Consortium <consortium@claroline.net>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Icap\BlogBundle\Listener;

use Claroline\CoreBundle\Event\AdminUserMergeActionEvent;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Icap\BlogBundle\Entity\Comment;
use Icap\BlogBundle\Manager\CommentManager;
use Icap\NotificationBundle\Entity\UserPickerContent;
use Icap\NotificationBundle\Manager\NotificationManager as NotificationManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("icap.blog_bundle.entity_listener.comment")
 * @DI\Tag("doctrine.entity_listener")
 */
class CommentListener
{
    /** @var  \Icap\NotificationBundle\Manager\NotificationManager */
    private $notificationManager;

    /** @var  \Icap\BlogBundle\Manager\CommentManager */
    private $commentManager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * @DI\InjectParams({
     *     "notificationManager" = @DI\Inject("icap.notification.manager"),
     *     "commentManager"      = @DI\Inject("icap.blog.manager.comment"),
     *     "translator"          = @DI\Inject("translator")
     * })
     */
    public function __construct(NotificationManager $notificationManager, CommentManager $commentManager, TranslatorInterface $translator)
    {
        $this->notificationManager = $notificationManager;
        $this->commentManager = $commentManager;
        $this->translator = $translator;
    }

    public function postPersist(Comment $comment, LifecycleEventArgs $event)
    {
        $userPicker = $comment->getUserPicker();
        $post = $comment->getPost();
        $blog = $post->getBlog();
        if (
            $post->isPublished() &&
            $comment->isPublished() &&
            $userPicker !== null &&
            count($userPicker->getUserIds()) > 0 &&
            $blog->getResourceNode() !== null
        ) {
            $details = array(
                'post' => array(
                    'blog' => $blog->getId(),
                    'title' => $post->getTitle(),
                    'slug' => $post->getSlug(),
                ),
                'comment' => array(
                    'id' => $comment->getId(),
                    'content' => $comment->getMessage(),
                    'published' => $comment->isPublished(),
                    'author' => $comment->getAuthor()->getFirstName().' '.$post->getAuthor()->getLastName(),
                    'authorId' => $comment->getAuthor()->getId(),
                ),
                'resource' => array(
                    'id' => $blog->getId(),
                    'name' => $blog->getResourceNode()->getName(),
                    'type' => $blog->getResourceNode()->getResourceType()->getName(),
                ),
            );
            $notification = $this->notificationManager->createNotification(
                'resource-icap_blog-comment-user_tagged',
                'blog',
                $blog->getResourceNode()->getId(),
                $details
            );
            $this->notificationManager->notifyUsers($notification, $userPicker->getUserIds());
        }
    }

    public function prePersist(Comment $comment, LifecycleEventArgs $event)
    {
        if ($comment->getMessage() !== null) {
            $userPicker = new UserPickerContent($comment->getMessage());
            $comment->setUserPicker($userPicker);
            $comment->setMessage($userPicker->getFinalText());
        }
    }

    public function preUpdate(Comment $comment, LifecycleEventArgs $event)
    {
        $this->prePersist($comment, $event);
    }

    public function postUpdate(Comment $comment, LifecycleEventArgs $event)
    {
        $this->postPersist($comment, $event);
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace comment author
        $count = $this->commentManager->replaceAuthor($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_comment_success', ['%count%' => $count], 'icap_blog');

        $event_message = $this->translator->trans(
            'merge_users_bundle_message_mask',
            [
                '%bundle_name%' => 'BlogBundle',
                '%bundle_message%' => $bundle_message,
            ],
            'platform'
        );

        $event->addMessage($event_message);
    }
}
