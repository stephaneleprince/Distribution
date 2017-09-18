<?php

namespace Icap\DropzoneBundle\Listener;

use Claroline\CoreBundle\Event\AdminUserMergeActionEvent;
use Icap\DropzoneBundle\Manager\DropManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("icap.dropzone_bundle.entity_listener.drop")
 * @DI\Tag("doctrine.entity_listener")
 */
class DropListener extends ContainerAware
{
    /** @var DropManager */
    private $dropManager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * @DI\InjectParams({
     *     "dropManager" = @DI\Inject("icap.manager.drop_manager"),
     *     "translator"  = @DI\Inject("translator")
     * })
     */
    public function __construct(DropManager $dropManager, TranslatorInterface $translator)
    {
        $this->dropManager = $dropManager;
        $this->translator = $translator;
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace drop user
        $count = $this->dropManager->replaceUser($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_drop_success', ['%count%' => $count], 'icap_dropzone');

        $event_message = $this->translator->trans(
            'merge_users_bundle_message_mask',
            [
                '%bundle_name%' => 'DropzoneBundle',
                '%bundle_message%' => $bundle_message,
            ],
            'platform'
        );

        $event->addMessage($event_message);
    }
}
