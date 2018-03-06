<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\Tool;

use Claroline\CoreBundle\Controller\Exception\WorkspaceAccessDeniedException;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Event\DisplayWidgetEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Controller of the workspace/desktop home page.
 *
 * @EXT\Route(
 *     "/home",
 *     options = {"expose"=true}
 * )
 */
class HomeController extends Controller
{
    private $authorization;
    private $eventDispatcher;

    /**
     * HomeController constructor.
     *
     * @DI\InjectParams({
     *     "authorization"   = @DI\Inject("security.authorization_checker"),
     *     "eventDispatcher" = @DI\Inject("event_dispatcher")
     * })
     */
    public function __construct(AuthorizationCheckerInterface $authorization, EventDispatcherInterface $eventDispatcher)
    {
        $this->authorization = $authorization;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Displays the desktop home.
     *
     * @EXT\Route("/desktop")
     * @EXT\Template("ClarolineCoreBundle:Tool:home.html.twig")
     *
     * @return array
     */
    public function displayDesktopAction()
    {
        return [

        ];
    }

    /**
     * @EXT\Route(
     *     "/{workspace}/home/display/tab/{tabId}",
     *     name="claro_workspace_home_display",
     *     options = {"expose"=true}
     * )
     * @EXT\Template("ClarolineCoreBundle:Tool\workspace\home:workspaceHome.html.twig")
     *
     * Displays the workspace home tool.
     *
     * @param \Claroline\CoreBundle\Entity\Workspace\Workspace $workspace
     *
     * @return array
     */
    public function workspaceHomeDisplayAction(Workspace $workspace, $tabId = -1)
    {
        $this->checkWorkspaceHomeAccess($workspace);
        $canEdit = $this->authorization->isGranted(['home', 'edit'], $workspace);

        return ['workspace' => $workspace, 'canEdit' => $canEdit, 'tabId' => $tabId];
    }

    /**
     * @EXT\Route(
     *     "/widget/instance/{widgetInstance}/content",
     *     name="claro_widget_instance_content",
     *     options={"expose"=true}
     * )
     *
     * Get a widget instance content.
     *
     * @param WidgetInstance $widgetInstance
     *
     * @return JsonResponse
     */
    public function getWidgetInstanceContentAction(WidgetInstance $widgetInstance)
    {
        $event = $this->eventDispatcher->dispatch(
            "widget_{$widgetInstance->getWidget()->getName()}",
            new DisplayWidgetEvent($widgetInstance)
        );

        return new JsonResponse($event->getContent());
    }

    private function checkWorkspaceHomeAccess(Workspace $workspace)
    {
        if (!$this->authorization->isGranted('home', $workspace)) {
            $exception = new WorkspaceAccessDeniedException();
            $exception->setWorkspace($workspace);

            throw $exception;
        }
    }
}
