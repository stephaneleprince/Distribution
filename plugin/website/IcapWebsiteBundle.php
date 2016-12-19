<?php

namespace Icap\WebsiteBundle;

use Claroline\CoreBundle\Library\PluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Claroline\KernelBundle\Bundle\ConfigurationProviderInterface;

class IcapWebsiteBundle extends PluginBundle implements ConfigurationProviderInterface
{
    public function getConfiguration($environment)
    {
        $config = new ConfigurationBuilder();

        return $config->addRoutingResource(__DIR__.'/Resources/config/routing.yml', null, 'icap_website');
    }
}
