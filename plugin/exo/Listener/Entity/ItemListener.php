<?php

namespace UJM\ExoBundle\Listener\Entity;

use Claroline\CoreBundle\Event\AdminUserMergeActionEvent;
use Doctrine\ORM\Event\LifecycleEventArgs;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Translation\TranslatorInterface;
use UJM\ExoBundle\Entity\Item\Item;
use UJM\ExoBundle\Library\Item\ItemDefinitionsCollection;
use UJM\ExoBundle\Manager\Item\ItemManager;

/**
 * Manages Life cycle of the Item.
 *
 * @DI\Service("ujm_exo.listener.entity_item")
 * @DI\Tag("doctrine.entity_listener")
 */
class ItemListener
{
    /**
     * @var ItemDefinitionsCollection
     */
    private $itemDefinitions;

    /** @var ItemManager */
    private $manager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * ItemListener constructor.
     *
     * @DI\InjectParams({
     *     "container"  = @DI\Inject("service_container"),
     *     "manager"    = @DI\Inject("ujm_exo.manager.item"),
     *     "translator" = @DI\Inject("translator")
     * })
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container, ItemManager $manager, TranslatorInterface $translator)
    {
        $this->itemDefinitions = $container->get('ujm_exo.collection.item_definitions');
        $this->manager = $manager;
        $this->translator = $translator;
    }

    /**
     * Loads the entity that holds the item type data when an Item is loaded.
     *
     * @param Item               $item
     * @param LifecycleEventArgs $event
     */
    public function postLoad(Item $item, LifecycleEventArgs $event)
    {
        $type = $this->itemDefinitions->getConvertedType($item->getMimeType());
        $definition = $this->itemDefinitions->get($type);
        $repository = $event
            ->getEntityManager()
            ->getRepository($definition->getEntityClass());

        /** @var \UJM\ExoBundle\Entity\ItemType\AbstractItem $typeEntity */
        $typeEntity = $repository->findOneBy([
            'question' => $item,
        ]);

        if (!empty($typeEntity)) {
            $item->setInteraction($typeEntity);
        }
    }

    /**
     * Persists the entity that holds the item type data when an Item is persisted.
     *
     * @param Item               $item
     * @param LifecycleEventArgs $event
     */
    public function prePersist(Item $item, LifecycleEventArgs $event)
    {
        $interaction = $item->getInteraction();
        if (null !== $interaction) {
            $event->getEntityManager()->persist($interaction);
        }
    }

    /**
     * Deletes the entity that holds the item type data when an Item is deleted.
     *
     * @param Item               $item
     * @param LifecycleEventArgs $event
     */
    public function preRemove(Item $item, LifecycleEventArgs $event)
    {
        $interaction = $item->getInteraction();
        if (null !== $interaction) {
            $event->getEntityManager()->remove($interaction);
        }
    }

    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserMergeActionEvent $event)
    {
        // Replace item creator
        $count = $this->manager->replaceCreator($event->getUserToRemove(), $event->getUserToKeep());

        $bundle_message = $this->translator->trans('merge_users_item_success', ['%count%' => $count], 'ujm_exo');

        $event_message = $this->translator->trans(
            'merge_users_bundle_message_mask',
            [
                '%bundle_name%' => 'ExoBundle',
                '%bundle_message%' => $bundle_message,
            ],
            'platform'
        );

        $event->addMessage($event_message);
    }
}
