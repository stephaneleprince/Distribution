<?php

namespace Icap\WikiBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Icap\WikiBundle\Entity\Section;
use Icap\WikiBundle\Repository\ContributionRepository;
use Icap\WikiBundle\Repository\SectionRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.wiki.section_manager")
 */
class SectionManager
{
    /**
     * @var ObjectManager
     */
    protected $om;

    /** @var \Icap\WikiBundle\Repository\SectionRepository */
    protected $sectionRepository;

    protected $contributionRepository;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager"),
     *     "sectionRepository" = @DI\Inject("icap.wiki.section_repository"),
     *     "contributionRepository" = @DI\Inject("icap.wiki.contribution_repository")
     * })
     */
    public function __construct(ObjectManager $om, SectionRepository $sectionRepository, ContributionRepository $contributionRepository)
    {
        $this->om = $om;
        $this->sectionRepository = $sectionRepository;
        $this->contributionRepository = $contributionRepository;
    }

    /**
     * @return \Icap\WikiBundle\Repository\SectionRepository
     */
    public function getSectionRepository()
    {
        return $this->sectionRepository;
    }

    public function getArchivedSectionsForPosition(Section $section)
    {
        $sections = $this->getSectionRepository()->findSectionsForPosition($section);
        $archivedSections = [];
        $prefixesArray = [];
        $childrens = [];
        foreach ($sections as $simpleSection) {
            if (isset($childrens[$simpleSection['parentId']])) {
                $childrens[$simpleSection['parentId']] += 1;
            } else {
                $childrens[$simpleSection['parentId']] = 1;
            }
            if (isset($prefixesArray[$simpleSection['parentId']])) {
                $prefix = $prefixesArray[$simpleSection['parentId']].$childrens[$simpleSection['parentId']];
            } else {
                $prefix = $childrens[$simpleSection['parentId']];
            }
            $archivedSections[$simpleSection['id']] = $prefix.' '.$simpleSection['title'];
            $prefixesArray[$simpleSection['id']] = '&nbsp;'.$prefix.'.';
        }

        return $archivedSections;
    }

    public function replaceAuthor($authorToRemove, $authorToKeep)
    {
        $sections = $this->sectionRepository->findByAuthor($authorToRemove);

        foreach($sections as $section) {
            $section->setAuthor($authorToKeep);
        }

        $this->om->flush();

        return count($sections);
    }
}
