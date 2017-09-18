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
use Icap\WikiBundle\Entity\Contribution;
use Icap\WikiBundle\Manager\ContributionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Translation\TranslatorInterface;


/**
 * @DI\Service("icap.wiki_bundle.entity_listener.contribution")
 * @DI\Tag("doctrine.entity_listener")
 */
class ContributionListener
{
    /** @var  \Icap\NotificationBundle\Manager\NotificationManager */
    private $notificationManager;

    /** @var  ContributionManager */
    private $contributionManager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * @DI\InjectParams({
     *     "notificationManager" = @DI\Inject("icap.notification.manager"),
     *     "contributionManager" = @DI\Inject("icap.wiki.contribution_manager"),
     *     "translator"          = @DI\Inject("translator"),
     * })
     */
    public function __construct(NotificationManager $notificationManager, ContributionManager $contributionManager, TranslatorInterface $translator)
    {
        $this->notificationManager = $notificationManager;
        $this->contributionManager = $contributionManager;
        $this->translator = $translator;
    }

    public function postPersist(Contribution $contribution, LifecycleEventArgs $event)
    {
        $userPicker = $contribution->getUserPicker();
        $section = $contribution->getSection();
        $wiki = $section->getWiki();
        if (
            $userPicker !== null &&
            count($userPicker->getUserIds()) > 0 &&
            $wiki->getResourceNode() !== null
        ) {
            $details = array(
                'contribution' => array(
                    'wiki' => $wiki->getId(),
                    'section' => $section->getId(),
                    'id' => $contribution->getId(),
                    'title' => $contribution->getTitle(),
                    'text' => $contribution->getText(),
                    'contributor' => $contribution->getContributor()->getFirstName().
                        ' '.
                        $contribution->getContributor()->getLastName(),
                ),
                'resource' => array(
                    'id' => $wiki->getId(),
                    'name' => $wiki->getResourceNode()->getName(),
                    'type' => $wiki->getResourceNode()->getResourceType()->getName(),
                ),
            );
            $notification = $this->notificationManager->createNotification(
                'resource-icap_wiki-user_tagged',
                'wiki',
                $wiki->getResourceNode()->getId(),
                $details,
                $contribution->getContributor()
            );
            $this->notificationManager->notifyUsers($notification, $userPicker->getUserIds());
        }
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace contribution author
        $count = $this->contributionManager->replaceContributor($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_contribution_success', ['%count%' => $count], 'icap_wiki');

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
