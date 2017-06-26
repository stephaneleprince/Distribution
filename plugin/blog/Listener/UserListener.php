<?php

namespace Icap\BlogBundle\Listener;

use Claroline\CoreBundle\Event\AdminUserActionEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.listener.blog.user_listener")
 */
class UserListener
{
    /**
     * @DI\Observe("claroline_users_merge")
     */
    public function onMergeUsers(AdminUserActionEvent $event)
    {
        // Transfert des resource nodes
        // Ajout des rôles
        // Transfert des workspaces et des inscriptions aux workspaces
        mail('david.tischmacher@gmail.com', 'blog', date('d/m/Y H:i:s'));


        $response = $this->httpKernel->handle($this->container->get('request'), HttpKernelInterface::SUB_REQUEST);
        $event->setResponse($response);
        $event->stopPropagation();
    }
}
