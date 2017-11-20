import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {tex} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/layout/resource/selectors'

import select from '#/plugin/exo/quiz/selectors'

const QuizStartButton = props =>
  <a href="#play" className="btn btn-quiz-start btn-primary btn-block">
    <span className={classes('fa', {
      'fa fa-play': !props.restart,
      'fa fa-repeat': props.restart
    })} />
    {tex(!props.restart ? 'quiz_start' : 'quiz_restart')}
  </a>

QuizStartButton.propTypes = {
  restart: T.bool.isRequired
}

const QuizStartMessage = props => {
  let errorMessage
  if (props.empty && props.editable) {
    errorMessage = 'quiz_empty_user_can_edit'
  } else if (props.empty && !props.editable) {
    errorMessage = 'quiz_empty_user_read_only'
  } else if (props.quizMaxAttemptsReached) {
    errorMessage = 'quiz_max_papers_reached'
  } else if (props.userMaxAttemptsReached) {
    errorMessage = 'user_max_papers_reached'
  } else if (props.userMaxAttemptsPerDayReached) {
    errorMessage = 'user_max_papers_per_day_reached'
  }

  return (
    <div className="alert alert-info">
      <span className="fa fa-fw fa-warning" />
      {tex(errorMessage)}
    </div>
  )
}

QuizStartMessage.propTypes = {
  editable: T.bool.isRequired,
  empty: T.bool.isRequired,
  quizMaxAttemptsReached: T.bool.isRequired,
  userMaxAttemptsReached: T.bool.isRequired,
  userMaxAttemptsPerDayReached: T.bool.isRequired
}

const QuizStart = props => props.startEnabled ?
  <QuizStartButton
    restart={props.restart}
  /> :
  <QuizStartMessage
    editable={props.editable}
    empty={props.empty}
    quizMaxAttemptsReached={props.quizMaxAttemptsReached}
    userMaxAttemptsReached={props.userMaxAttemptsReached}
    userMaxAttemptsPerDayReached={props.userMaxAttemptsPerDayReached}
  />

QuizStart.propTypes = {
  editable: T.bool.isRequired,
  startEnabled: T.bool.isRequired,
  restart: T.bool.isRequired,
  empty: T.bool.isRequired,
  quizMaxAttemptsReached: T.bool.isRequired,
  userMaxAttemptsReached: T.bool.isRequired,
  userMaxAttemptsPerDayReached: T.bool.isRequired
}

const ConnectedQuizStart = connect(
  (state) => ({
    editable: resourceSelect.editable(state),
    startEnabled: select.startEnabled(state),
    restart: select.hasUserPapers(state),
    empty: select.empty(state),
    quizMaxAttemptsReached: select.quizMaxAttemptsReached(state),
    userMaxAttemptsReached: select.userMaxAttemptsReached(state),
    userMaxAttemptsPerDayReached: select.userMaxAttemptsPerDayReached(state)
  }),
  null
)(QuizStart)

export {
  ConnectedQuizStart as QuizStart
}
