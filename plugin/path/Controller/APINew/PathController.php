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

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Entity\User;
//use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Innova\PathBundle\Entity\Step;
use Innova\PathBundle\Manager\UserProgressionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\Request;

/**
 * @ApiMeta(class="Innova\PathBundle\Entity\Path\Path")
 * @EXT\Route("/path")
 */
class PathController extends AbstractCrudController
{
//    use PermissionCheckerTrait;

    /** @var SerializerProvider */
    protected $serializer;

    /**
     * @var UserProgressionManager
     */
    protected $userProgressionManager;

    /**
     * PathController constructor.
     *
     * @DI\InjectParams({
     *     "serializer"             = @DI\Inject("claroline.api.serializer"),
     *     "userProgressionManager" = @DI\Inject("innova_path.manager.user_progression")
     * })
     *
     * @param SerializerProvider     $serializer
     * @param UserProgressionManager $userProgressionManager
     */
    public function __construct(SerializerProvider $serializer, UserProgressionManager $userProgressionManager)
    {
        $this->serializer = $serializer;
        $this->userProgressionManager = $userProgressionManager;
    }

    /**
     * Update step progression for an user.
     *
     * @EXT\Route("/step/{id}/progression/update", name="innova_path_step_progression_update")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter(
     *     "step",
     *     class="InnovaPathBundle:Step",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Step    $step
     * @param User    $user
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function stepProgressionUpdateAction(Step $step, User $user, Request $request)
    {
//        $this->checkPermission('OPEN', $step->getPath()->getResourceNode(), [], true);
        $status = $request->get('status');
        $this->userProgressionManager->update($step, $user, $status, true);
        $this->userProgressionManager->generateResourceEvaluation($step, $user, $status);
        $resourceUserEvaluation = $this->userProgressionManager->getResourceUserEvaluation($step->getPath(), $user);

        return new JsonResponse($this->serializer->serialize($resourceUserEvaluation));
    }

    public function getName()
    {
        return 'path';
    }
}
