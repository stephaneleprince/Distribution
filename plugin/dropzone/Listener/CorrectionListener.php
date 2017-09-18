<?php

namespace Icap\DropzoneBundle\Listener;

use Claroline\CoreBundle\Event\AdminUserMergeActionEvent;
use Icap\DropzoneBundle\Manager\CorrectionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("icap.dropzone_bundle.entity_listener.correction")
 * @DI\Tag("doctrine.entity_listener")
 */
class CorrectionListener extends ContainerAware
{
    /** @var  CorrectionManager */
    private $correctionManager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * @DI\InjectParams({
     *     "correctionManager" = @DI\Inject("icap.manager.correction_manager"),
     *     "translator"        = @DI\Inject("translator")
     * })
     */
    public function __construct(CorrectionManager $correctionManager, TranslatorInterface $translator)
    {
        $this->correctionManager = $correctionManager;
        $this->translator = $translator;
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace correction user
        $count = $this->correctionManager->replaceUser($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_correction_success', ['%count%' => $count], 'icap_dropzone');

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
