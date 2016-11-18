<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Twig;

use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @DI\Service("claroline.extension.webpack.javascripts")
 * @DI\Tag("twig.extension")
 */
class WebpackJavascriptsExtension extends \Twig_Extension
{
    /** @var array */
    private $scriptsToLoad;
    /** @var null|\Symfony\Component\HttpFoundation\Request */
    private $request;

    /**
     * @DI\InjectParams({
     *     "requestStack"   = @DI\Inject("request_stack")
     * })
     *
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->scriptsToLoad = [];
    }

    public function getGlobals()
    {
        return [
            'scriptsToLoad' => $this->scriptsToLoad,
        ];
    }

    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('appendScript', [$this, 'appendScript'], ['is_safe' => ['html']]),
            new \Twig_SimpleFunction('loadAppendedScripts', [$this, 'loadAppendedScripts'], ['is_safe' => ['html']]),
        ];
    }

    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('appendScript', [$this, 'appendScript'], ['is_safe' => ['html']]),
        ];
    }

    public function getName()
    {
        return 'webpack_javascripts_extension';
    }

    /**
     * Appends script to "scriptsToLoad" array.
     * An array that contains scripts that should be loaded after
     * main/common javascripts files on the page have been loaded.
     * However if request is an Ajax request then loads script directly.
     *
     * @param string $script
     *
     * @return string | nothing
     */
    public function appendScript($script)
    {
        if ($this->request->isXmlHttpRequest()) {
            return '<script src="'.$script.'"></script>';
        }
        $this->scriptsToLoad[] = $script;
    }

    /**
     * Loads all scripts appended to "scriptsToLoad" array.
     *
     * @return string
     */
    public function loadAppendedScripts()
    {
        $scriptsHtml = '';
        foreach ($this->scriptsToLoad as $script) {
            $scriptsHtml .= '<script src="'.$script.'"></script>'.PHP_EOL;
        }

        return $scriptsHtml;
    }
}
