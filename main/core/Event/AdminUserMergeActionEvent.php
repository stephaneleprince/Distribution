<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event;

use Claroline\CoreBundle\Entity\User;
use Symfony\Component\EventDispatcher\Event;

class AdminUserMergeActionEvent extends Event implements MandatoryEventInterface, DataConveyorEventInterface
{
    private $isPopulated;
    private $messages = [];

    private $userToKeep;
    private $userToRemove;

    public function __construct(User $userToKeep, User $userToRemove)
    {
        $this->isPopulated = false;

        $this->userToKeep = $userToKeep;
        $this->userToRemove = $userToRemove;
    }

    public function getUserToKeep()
    {
        return $this->userToKeep;
    }

    public function getUserToRemove()
    {
        return $this->userToRemove;
    }

    public function addMessage($message)
    {
        $this->messages[] = $message;
        $this->isPopulated = true;

        return $this;
    }

    public function getMessages()
    {
        return $this->messages;
    }

    public function isPopulated()
    {
        return $this->isPopulated;
    }

}
