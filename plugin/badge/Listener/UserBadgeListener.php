<?php

namespace Icap\BadgeBundle\Listener;

use Claroline\CoreBundle\Event\AdminUserMergeActionEvent;
use Icap\BadgeBundle\Manager\UserBadgeManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("icap.badge_bundle.entity_listener.user_badge")
 * @DI\Tag("doctrine.entity_listener")
 */
class UserBadgeListener extends ContainerAware
{
    /** @var  UserBadgeManager */
    private $manager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * @DI\InjectParams({
     *     "manager"    = @DI\Inject("icap.manager.user_badge_manager"),
     *     "translator" = @DI\Inject("translator")
     * })
     */
    public function __construct(UserBadgeManager $manager, TranslatorInterface $translator)
    {
        $this->manager = $manager;
        $this->translator = $translator;
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace user in user badge association
        $count = $this->manager->replaceUser($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_user_badge_success', ['%count%' => $count], 'icap_badge');

        $event_message = $this->translator->trans(
            'merge_users_bundle_message_mask',
            [
                '%bundle_name%' => 'BadgeBundle',
                '%bundle_message%' => $bundle_message,
            ],
            'platform'
        );

        $event->addMessage($event_message);
    }
}
