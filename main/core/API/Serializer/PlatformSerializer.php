<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\VersionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.serializer.platform")
 */
class PlatformSerializer
{
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var PlatformConfigurationHandler */
    private $config;

    /** @var VersionManager */
    private $versionManager;

    /**
     * ThemeSerializer constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"   = @DI\Inject("security.token_storage"),
     *     "config"         = @DI\Inject("claroline.config.platform_config_handler"),
     *     "versionManager" = @DI\Inject("claroline.manager.version_manager"),
     *     "userSerializer" = @DI\Inject("claroline.serializer.user")
     * })
     *
     * @param TokenStorageInterface        $tokenStorage
     * @param PlatformConfigurationHandler $config
     * @param VersionManager               $versionManager
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        PlatformConfigurationHandler $config,
        VersionManager $versionManager
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->config = $config;
        $this->versionManager = $versionManager;
    }

    /**
     * Serializes required information for FrontEnd rendering.
     */
    public function serialize()
    {
        return [
            'name' => 'Claroline',
            'description' => '', // the one for the current locale
            'version' => $this->versionManager->getDistributionVersion(),
            'environment' => 'prod',
            'server' => [
                'protocol' => '',
                'host' => '',
            ],
            'theme' => [
                'name' => $this->config->getParameter('theme'),
                'main' => 'path_to_bootstrap',
            ],
            'locale' => [
                'current' => '',
                'available' => [],
            ],
            'openGraph' => [
                'enabled' => $this->config->getParameter('enable_opengraph'),
                'targets' => [
                    'url',
                    'resource',
                    'url-resource',
                ],
            ],
        ];
    }
}
