import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
// import {displayDate} from '#/main/core/scaffolding/date'
// import {actions as modalActions} from '#/main/core/layout/modal/actions'
// import {MODAL_GENERIC_TYPE_PICKER} from '#/main/core/layout/modal'

import {ResourceOverview} from '#/main/core/resource/components/overview.jsx'

// import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'
import {select} from '#/plugin/path/resources/path/selectors'
// import {actions} from '#/plugin/drop-zone/resources/dropzone/player/actions'
// import {DropzoneType, DropType} from '#/plugin/drop-zone/resources/dropzone/prop-types'

// import {Parameters} from '#/plugin/drop-zone/resources/dropzone/overview/components/parameters.jsx'
// import {Timeline} from '#/plugin/drop-zone/resources/dropzone/overview/components/timeline.jsx'

const OverviewComponent = props =>
  <ResourceOverview
    contentText={props.path.description ||
      <span className="empty-text">{trans('no_description', {}, 'path')}</span>
    }
    // progression={{
    //   status: props.userEvaluation ? props.userEvaluation.status : undefined,
    //   statusTexts: {
    //     opened: 'Vous n\'avez jamais soumis de travaux.'
    //   },
    //   score: {
    //     displayed: props.dropzone.display.showScore,
    //     current: props.myDrop ? props.myDrop.score : null,
    //     total: props.dropzone.parameters.scoreMax
    //   },
    //   feedback: {
    //     displayed: props.dropzone.display.showFeedback,
    //     success: props.dropzone.display.successMessage,
    //     failure: props.dropzone.display.failMessage
    //   },
    //   details: [
    //     [
    //       trans('drop_date', {}, 'dropzone'),
    //       props.myDrop && props.myDrop.dropDate ?
    //         displayDate(props.myDrop.dropDate, false, true) :
    //         trans('not_submitted', {}, 'dropzone')
    //     ],
    //     constants.REVIEW_TYPE_PEER === props.dropzone.parameters.reviewType && [
    //       'Nbre de corrections reçues',
    //       `${props.myDrop ? props.myDrop.corrections.length : '0'} / ${props.dropzone.parameters.expectedCorrectionTotal}`
    //     ],
    //     constants.REVIEW_TYPE_PEER === props.dropzone.parameters.reviewType && [
    //       'Nbre de corrections faîtes',
    //       `${props.nbCorrections} / ${props.dropzone.parameters.expectedCorrectionTotal}`
    //     ]
    //   ].filter(value => !!value)
    // }}
    actions={[
      // {
      //   icon: 'fa fa-fw fa-upload icon-with-text-right',
      //   label: trans(!props.myDrop ? 'start_evaluation' : (!props.myDrop.finished ? 'continue_evaluation' : 'show_evaluation'), {}, 'dropzone'),
      //   action: !props.myDrop ? () => props.startDrop(props.dropzone.parameters.dropType, props.teams) : '#/my/drop',
      //   primary: !props.myDrop || !props.myDrop.finished,
      //   disabled: !props.dropEnabled,
      //   disabledMessages: props.dropDisabledMessages
      // }, {
      //   icon: 'fa fa-fw fa-check-square-o icon-with-text-right',
      //   label: trans('correct_a_copy', {}, 'dropzone'),
      //   action: '#/peer/drop',
      //   primary: props.myDrop && props.myDrop.finished,
      //   disabled: !props.peerReviewEnabled,
      //   disabledMessages: props.peerReviewDisabledMessages
      // }
    ]}
  >
    <section className="resource-parameters">
      <h3 className="h2">{trans('path_configuration', {}, 'path')}</h3>

      {/*<Parameters*/}
        {/*dropType={props.dropzone.parameters.dropType}*/}
        {/*reviewType={props.dropzone.parameters.reviewType}*/}
      {/*/>*/}

      {/*<Timeline*/}
        {/*state={props.currentState}*/}
        {/*planning={props.dropzone.planning}*/}
        {/*reviewType={props.dropzone.parameters.reviewType}*/}
      {/*/>*/}
    </section>
  </ResourceOverview>

OverviewComponent.propTypes = {
  path: T.object.isRequired
}

const Overview = connect(
  (state) => ({
    path: select.path(state)
  }),
  (dispatch) => ({})
)(OverviewComponent)

export {
  Overview
}
