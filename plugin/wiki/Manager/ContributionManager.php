<?php

namespace Icap\WikiBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Icap\HtmlDiff\HtmlDiff;
use Icap\WikiBundle\Entity\Contribution;
use Icap\WikiBundle\Entity\Section;
use Icap\WikiBundle\Repository\ContributionRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.wiki.contribution_manager")
 */
class ContributionManager
{
    /**
     * @var ObjectManager
     */
    protected $om;

    /** @var \Icap\WikiBundle\Repository\ContributionRepository */
    protected $contributionRepository;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager"),
     *     "contributionRepository" = @DI\Inject("icap.wiki.contribution_repository")
     * })
     */
    public function __construct(ObjectManager $om, ContributionRepository $contributionRepository)
    {
        $this->om = $om;
        $this->contributionRepository = $contributionRepository;
    }

    /**
     * @return \Icap\WikiBundle\Repository\ContributionRepository
     */
    public function getContributionRepository()
    {
        return $this->contributionRepository;
    }

    /**
     * @param Section $section
     * @param array   $ids
     *
     * @return array $contributions
     */
    public function compareContributions(Section $section, $ids)
    {
        $contributions = $this->contributionRepository->findyBySectionAndIds($section, $ids);
        $titleDiff = new HtmlDiff($contributions[0]->getTitle(), $contributions[1]->getTitle(), false);
        $textDiff = new HtmlDiff($contributions[0]->getText(), $contributions[1]->getText(), true);
        $contribution = new Contribution();
        $contribution->setText($textDiff->outputDiff()->toString());
        $contribution->setTitle($titleDiff->outputDiff()->toString());
        $contribution->setContributor($contributions[1]->getContributor());
        $contribution->setCreationDate($contributions[1]->getCreationDate());
        $contributions[1] = $contribution;

        return $contributions;
    }

    public function getContributions(Section $section)
    {
        return $this->contributionRepository->findAllForSection($section);
    }

    public function getContribution(Contribution $contribution)
    {
        return $this->contributionRepository->findById($contribution->getId());
    }

    public function replaceContributor($contributorToRemove, $contributorToKeep)
    {
        $contributions = $this->contributionRepository->findByContributor($contributorToRemove);

        foreach($contributions as $contribution) {
            $contribution->setContributor($contributorToKeep);
        }

        $this->om->flush();

        return count($contributions);
    }
}
