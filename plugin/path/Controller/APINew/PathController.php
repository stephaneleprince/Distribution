<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Innova\PathBundle\Controller\APINew;

use Claroline\CoreBundle\Annotations\ApiMeta;
use Claroline\CoreBundle\Controller\APINew\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @ApiMeta(class="Innova\PathBundle\Entity\Path\Path")
 * @EXT\Route("/path")
 */
class PathController extends AbstractCrudController
{
    public function getName()
    {
        return 'path';
    }
}
