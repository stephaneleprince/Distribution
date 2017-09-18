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
use Icap\BlogBundle\Entity\Post;
use Icap\BlogBundle\Manager\PostManager;
use Icap\NotificationBundle\Entity\UserPickerContent;
use Icap\NotificationBundle\Manager\NotificationManager as NotificationManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("icap.blog_bundle.entity_listener.post")
 * @DI\Tag("doctrine.entity_listener")
 */
class PostListener
{
    /** @var  \Icap\NotificationBundle\Manager\NotificationManager */
    private $notificationManager;

    /** @var PostManager */
    private $postManager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * @DI\InjectParams({
     * "notificationManager" = @DI\Inject("icap.notification.manager"),
     * "postManager"         = @DI\Inject("icap.blog.manager.post"),
     * "translator"          = @DI\Inject("translator"),
     * })
     */
    public function __construct(NotificationManager $notificationManager, PostManager $postManager, TranslatorInterface $translator)
    {
        $this->notificationManager = $notificationManager;
        $this->postManager = $postManager;
        $this->translator = $translator;
    }

    public function postPersist(Post $post, LifecycleEventArgs $event)
    {
        $userPicker = $post->getUserPicker();
        $blog = $post->getBlog();
        if (
            $post->isPublished() &&
            $userPicker !== null &&
            count($userPicker->getUserIds()) > 0 &&
            $blog->getResourceNode() !== null
        ) {
            $details = array(
                'post' => array(
                    'blog' => $blog->getId(),
                    'title' => $post->getTitle(),
                    'slug' => $post->getSlug(),
                    'published' => $post->isPublished(),
                    'author' => $post->getAuthor()->getFirstName().' '.$post->getAuthor()->getLastName(),
                    'authorId' => $post->getAuthor()->getId(),
                ),
                'resource' => array(
                    'id' => $blog->getId(),
                    'name' => $blog->getResourceNode()->getName(),
                    'type' => $blog->getResourceNode()->getResourceType()->getName(),
                ),
            );
            $notification = $this->notificationManager->createNotification(
                'resource-icap_blog-post-user_tagged',
                'blog',
                $blog->getResourceNode()->getId(),
                $details
            );
            $this->notificationManager->notifyUsers($notification, $userPicker->getUserIds());
        }
    }

    public function prePersist(Post $post, LifecycleEventArgs $event)
    {
        if ($post->getContent() !== null) {
            $userPicker = new UserPickerContent($post->getContent());
            $post->setUserPicker($userPicker);
            $post->setContent($userPicker->getFinalText());
        }
    }

    public function preUpdate(Post $post, LifecycleEventArgs $event)
    {
        $this->prePersist($post, $event);
    }

    public function postUpdate(Post $post, LifecycleEventArgs $event)
    {
        $this->postPersist($post, $event);
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace post author
        $count = $this->postManager->replaceAuthor($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_post_success', ['%count%' => $count], 'icap_blog');

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
