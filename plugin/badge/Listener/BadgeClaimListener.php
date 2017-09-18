<?php

namespace Icap\BadgeBundle\Listener;

use Claroline\CoreBundle\Event\AdminUserMergeActionEvent;
use Icap\BadgeBundle\Manager\BadgeClaimManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("icap.badge_bundle.entity_listener.badge_claim")
 * @DI\Tag("doctrine.entity_listener")
 */
class BadgeClaimListener extends ContainerAware
{
    /** @var  BadgeClaimManager */
    private $manager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * @DI\InjectParams({
     *     "manager"    = @DI\Inject("icap_badge.manager.badge_claim"),
     *     "translator" = @DI\Inject("translator")
     * })
     */
    public function __construct(BadgeClaimManager $manager, TranslatorInterface $translator)
    {
        $this->manager = $manager;
        $this->translator = $translator;
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace badge claim user
        $count = $this->manager->replaceUser($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_badge_claim_success', ['%count%' => $count], 'icap_badge');

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
