import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {tex} from '#/main/core/translation'
import {
  correctionModes,
  markModes,
  quizTypes,
  SHOW_CORRECTION_AT_DATE
} from './../enums'

import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {ScoreGauge} from '#/plugin/exo/components/score-gauge.jsx'
import {QuizStart} from '#/plugin/exo/quiz/components/quiz-start.jsx'

const Parameter = props =>
  <tr>
    <th className="text-right col-md-4" scope="row">
      {tex(props.name)}
    </th>
    <td className="text-center col-md-8">
      {props.children}
    </td>
  </tr>

Parameter.propTypes = {
  name: T.string.isRequired,
  children: T.any.isRequired
}

const Parameters = props =>
  <div className="panel panel-default">
    <table className="table table-striped table-bordered">
      <tbody>
        {props.parameters.duration > 0 &&
          <Parameter name="duration">{props.parameters.duration}</Parameter>
        }
        <Parameter name="availability_of_correction">
          {props.parameters.showCorrectionAt === SHOW_CORRECTION_AT_DATE ?
            props.parameters.correctionDate :
            tex(correctionModes.find(mode => mode[0] === props.parameters.showCorrectionAt)[1])
          }
        </Parameter>
        <Parameter name="availability_of_score">
          {tex(markModes.find(mode => mode[0] === props.parameters.showScoreAt)[1])}
        </Parameter>
      </tbody>
        {props.editable && props.additionalInfo &&
          <tbody>
            <Parameter name="type">
              {tex(quizTypes.find(type => type[0] === props.parameters.type)[1])}
            </Parameter>
            <Parameter name="number_steps_draw">
              {props.parameters.pick || tex('all_step')}
            </Parameter>
            <Parameter name="random_steps">
              {tex(props.parameters.randomOrder ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="keep_same_step">
              {tex(props.parameters.randomPick ? 'no' : 'yes')}
            </Parameter>
            <Parameter name="anonymous">
              {tex(props.parameters.anonymizeAttempts ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="test_exit">
              {tex(props.parameters.interruptible ? 'yes' : 'no')}
            </Parameter>
            <Parameter name="maximum_tries">
              {props.parameters.maxAttempts || '-'}
            </Parameter>
            <Parameter name="maximum_attempts_per_day">
              {props.parameters.maxAttemptsPerDay || '-'}
            </Parameter>
            <Parameter name="maximum_papers">
              {props.parameters.maxPapers || '-'}
            </Parameter>
            <Parameter name="maximum_papers">
              {props.parameters.maxPapers || '-'}
            </Parameter>
            <Parameter name="mandatory_questions">
              {props.parameters.mandatoryQuestions ? 'yes': 'no'}
            </Parameter>
          </tbody>
        }
    </table>
    {props.editable &&
      <div
        className="panel-footer text-center toggle-exercise-info"
        role="button"
        onClick={props.onAdditionalToggle}
      >
        <span className={classes('fa', 'fa-fw', props.additionalInfo ? 'fa-caret-up' : 'fa-caret-right')}/>
        {tex(props.additionalInfo ? 'hide_additional_info' : 'show_additional_info')}
      </div>
    }
  </div>

Parameters.propTypes = {
  editable: T.bool.isRequired,
  additionalInfo: T.bool.isRequired,
  onAdditionalToggle: T.func.isRequired,
  parameters: T.shape({
    type: T.string.isRequired,
    randomOrder: T.string.isRequired,
    randomPick: T.string.isRequired,
    pick: T.number.isRequired,
    duration: T.number.isRequired,
    maxPapers: T.number.isRequired,
    maxAttempts: T.number.isRequired,
    maxAttemptsPerDay: T.number.isRequired,
    mandatoryQuestions: T.bool.isRequired,
    interruptible: T.bool.isRequired,
    showCorrectionAt: T.string.isRequired,
    correctionDate: T.string,
    anonymizeAttempts: T.bool.isRequired,
    showScoreAt: T.string.isRequired
  }).isRequired
}

const ParameterGridItem = props =>
  <div className="quiz-parameter">
    {props.children}
  </div>

const ParametersGrid = props =>
  <div className="quiz-parameters-grid">
    <ParameterGridItem>
      <span className="quiz-parameter-heading">10</span>
      <span className="quiz-parameter-value">étapes</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading">14</span>
      <span className="quiz-parameter-value">questions</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading fa fa-random" />
      <span className="quiz-parameter-value">aléatoire</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading">100</span>
      <span className="quiz-parameter-value">points</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading fa fa-clock-o" />
      <span className="quiz-parameter-value">1h30min</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading fa fa-ban" />
      <span className="quiz-parameter-value">pas d'interruption</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading fa fa-repeat" />
      <span className="quiz-parameter-value">10 fois</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading fa fa-repeat" />
      <span className="quiz-parameter-value">1 fois/jour</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading fa fa-user-secret" />
      <span className="quiz-parameter-value">réponses anonymes</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading fa fa-check-square-o" />
      <span className="quiz-parameter-value">le 23/05/2018</span>
    </ParameterGridItem>

    <ParameterGridItem>
      <span className="quiz-parameter-heading fa fa-percent" />
      <span className="quiz-parameter-value">en même temps que les résultats</span>
    </ParameterGridItem>
  </div>

// !props.empty && props.parameters.showMetadata &&

const UserProgression = props =>
  <div className="panel panel-default user-progression">
    <div className="panel-body">
      <ScoreGauge maxScore={100} />

      <h2 className="h5">Vous n'avez jamais répondu à ce quiz</h2>
    </div>

    <ul className="list-group">
      <li className="list-group-item">
        Nbre d'essais aujourd'hui
        <span className="attempts-count">1 / 10</span>
      </li>
      <li className="list-group-item">
        Nbre d'essais total
        <span className="attempts-count">20</span>
      </li>
    </ul>


  </div>

const Layout = props =>
  <div className="quiz-overview">
    <div className="row">
      <div className="col-md-4">
        <UserProgression />
        <QuizStart />
      </div>

      <div className="col-md-8">
        {props.description &&
          <div className="quiz-description panel panel-default">
            <HtmlText className="panel-body">{props.description}</HtmlText>
          </div>
        }

        {props.description && props.parameters.showMetadata &&
          <hr/>
        }

        {props.parameters.showMetadata &&
          <div className="quiz-parameters">
            <div className="quiz-parameter-primary">
              <span className="quiz-parameter-heading fa fa-graduation-cap" />
              <span className="quiz-parameter-value">Exercice Formatif</span>
            </div>
            <ParametersGrid />
          </div>
        }
      </div>
    </div>
  </div>

Layout.propTypes = {
  empty: T.bool.isRequired,
  editable: T.bool.isRequired,
  description: T.string,
  onAdditionalToggle: T.func.isRequired,
  parameters: T.shape({
    showMetadata: T.bool.isRequired,
    maxAttempts: T.number.isRequired,
    maxAttemptsPerDay: T.number.isRequired,
    maxPapers: T.number.isRequired
  }).isRequired,
  meta: T.shape({
    userPaperCount: T.number.isRequired,
    userPaperDayCount: T.number.isRequired,
    paperCount: T.number.isRequired
  }).isRequired
}

Layout.defaultProps = {
  description: null
}

class Overview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      additionalInfo: false
    }
  }

  render() {
    return (
      <Layout
        empty={this.props.empty}
        editable={this.props.editable}
        description={this.props.quiz.description}
        parameters={this.props.quiz.parameters}
        meta={this.props.quiz.meta}
        additionalInfo={this.state.additionalInfo}
        onAdditionalToggle={() => this.setState({
          additionalInfo: !this.state.additionalInfo
        })}
      />
    )
  }
}

Overview.propTypes = {
  empty: T.bool.isRequired,
  editable: T.bool.isRequired,
  quiz: T.shape({
    description: T.string,
    meta: T.object.isRequired,
    parameters: T.object.isRequired
  }).isRequired
}

export {Overview}
