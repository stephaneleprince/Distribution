<?php

namespace Claroline\ForumBundle\Listener;

use Claroline\CoreBundle\Event\AdminUserMergeActionEvent;
use Claroline\ForumBundle\Manager\Manager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service()
 */
class SubjectListener extends ContainerAware
{
    /** @var  \Claroline\ForumBundle\Manager\Manager */
    private $manager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "manager"    = @DI\Inject("claroline.manager.forum_manager"),
     *     "translator" = @DI\Inject("translator")
     * })
     */
    public function __construct(
        Manager $manager,
        TranslatorInterface $translator
    ) {
        $this->manager = $manager;
        $this->translator = $translator;
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace subject creator
        $count = $this->manager->replaceSubjectCreator($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_subject_success', ['%count%' => $count], 'forum');

        $event_message = $this->translator->trans(
            'merge_users_bundle_message_mask',
            [
                '%bundle_name%' => 'ForumBundle',
                '%bundle_message%' => $bundle_message,
            ],
            'platform'
        );

        $event->addMessage($event_message);
    }
}
