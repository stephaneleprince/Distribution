import React from 'react'
import {shallow} from 'enzyme'
import {spyConsole, renew, ensure} from '#/main/core/tests'
import {SubSection2} from './sub-section2.jsx'

describe('<SubSection2/>', () => {
  beforeEach(() => {
    spyConsole.watch()
    renew(SubSection2, 'SubSection2')
  })
  afterEach(spyConsole.restore)

  it('has required props', () => {
    shallow(<SubSection2/>)
    ensure.missingProps(
      'SubSection2',
      ['hidden', 'showText', 'hideText', 'toggle', 'children']
    )
  })

  it('has typed props', () => {
    shallow(
      <SubSection2
        hidden="foo"
        showText={123}
        hideText={false}
        toggle="bar"
      >
        Bar
      </SubSection2>
    )
    ensure.invalidProps(
      'SubSection2',
      ['hidden', 'showText', 'hideText', 'toggle']
    )
  })

  it('if hidden, renders a link to show section', () => {
    let toggled = false

    const section = shallow(
      <SubSection2
        hidden={true}
        showText="Show section"
        hideText="Hide section"
        toggle={() => toggled = true}
      >
        Bar
      </SubSection2>
    )

    ensure.propTypesOk()

    const showLink = section.childAt(0)
    ensure.equal(showLink.name(), 'a')
    ensure.equal(showLink.text(), 'Show section')
    showLink.simulate('click')
    ensure.equal(toggled, true)
  })

  it('if shown, renders a link to hide section', () => {
    let toggled = false

    const section = shallow(
      <SubSection2
        hidden={false}
        showText="Show section"
        hideText="Hide section"
        toggle={() => toggled = true}
      >
        Bar
      </SubSection2>
    )

    ensure.propTypesOk()

    const hideLink = section.find('a')
    ensure.equal(hideLink.length, 1)
    ensure.equal(hideLink.text(), 'Hide section')
    hideLink.simulate('click')
    ensure.equal(toggled, true)
  })
})
