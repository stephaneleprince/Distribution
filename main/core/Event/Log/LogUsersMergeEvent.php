<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event\Log;

class LogUsersMergeEvent extends LogGenericEvent
{
    const ACTION = 'users-merge';

    /**
     * Constructor.
     */
    public function __construct($user_kept, $user_removed)
    {
        parent::__construct(
            self::ACTION,
            array(
                'userKept' => array(
                    'lastName' => $user_kept->getLastName(),
                    'firstName' => $user_kept->getFirstName(),
                ),
                'userRemoved' => array(
                    'lastName' => $user_removed->getLastName(),
                    'firstName' => $user_removed->getFirstName(),
                ),
            ),
            $user_kept
        );
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return array(self::DISPLAYED_ADMIN);
    }
}
