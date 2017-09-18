<?php

/*
* This file is part of the Claroline Connect package.
*
* (c) Claroline Consortium <consortium@claroline.net>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

namespace Icap\WikiBundle\Listener;

use Claroline\CoreBundle\Event\AdminUserMergeActionEvent;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Icap\NotificationBundle\Manager\NotificationManager as NotificationManager;
use Icap\WikiBundle\Manager\SectionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Translation\TranslatorInterface;


/**
 * @DI\Service("icap.wiki_bundle.entity_listener.section")
 * @DI\Tag("doctrine.entity_listener")
 */
class SectionListener
{
    /** @var  \Icap\NotificationBundle\Manager\NotificationManager */
    private $notificationManager;

    /** @var  SectionManager */
    private $sectionManager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * @DI\InjectParams({
     *     "notificationManager" = @DI\Inject("icap.notification.manager"),
     *     "sectionManager"      = @DI\Inject("icap.wiki.section_manager"),
     *     "translator"          = @DI\Inject("translator"),
     * })
     */
    public function __construct(NotificationManager $notificationManager, SectionManager $sectionManager, TranslatorInterface $translator)
    {
        $this->notificationManager = $notificationManager;
        $this->sectionManager = $sectionManager;
        $this->translator = $translator;
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace contribution author
        $count = $this->sectionManager->replaceAuthor($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_section_success', ['%count%' => $count], 'icap_wiki');

        $event_message = $this->translator->trans(
            'merge_users_bundle_message_mask',
            [
                '%bundle_name%' => 'WikiBundle',
                '%bundle_message%' => $bundle_message,
            ],
            'platform'
        );

        $event->addMessage($event_message);
    }
}
