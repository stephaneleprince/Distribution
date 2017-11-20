import {createSelector} from 'reselect'

import {select as resourceSelect} from '#/main/core/layout/resource/selectors'

// TODO : use reselect
// TODO : there is possible code refactoring with editor/selectors.js

const empty = state => state.quiz.steps.length === 0
const quiz = state => state.quiz
const steps = state => state.steps
const items = state => state.items
const id = state => state.quiz.id
const description = state => state.quiz.description
const parameters = state => state.quiz.parameters
const title = state => state.quiz.title
const meta = state => state.quiz.meta
const viewMode = state => state.viewMode

const hasPapers = state => state.quiz.meta.paperCount > 0 || (state.papers.papers && state.papers.papers.length > 0)
const hasUserPapers = state => state.quiz.meta.userPaperCount > 0

const registered = state => state.quiz.meta.registered
const saveEnabled = state => !state.editor.saved && !state.editor.saving
const editorOpened = state => state.editor.opened
const noItems = state =>
  Object.keys(state.quiz.steps).length === 1 && Object.keys(state.items).length === 0
const firstStepId = state => state.quiz.steps[0]
const hasOverview = state => state.quiz.parameters.showOverview
const testMode = state => state.quiz.testMode
const papersShowExpectedAnswers = state => state.quiz.parameters.showFullCorrection
const papersShowStatistics = state => state.quiz.parameters.showStatistics
const allPapersStatistics = state => state.quiz.parameters.allPapersStatistics

const quizNumbering = createSelector(
  parameters,
  (parameters) => parameters.numbering
)

const papersAdmin = createSelector(
  [resourceSelect.currentRights],
  (currentRights) => !!currentRights.manage_papers
)

const docimologyAdmin = createSelector(
  [resourceSelect.currentRights],
  (currentRights) => !!currentRights.view_docimology
)

/**
 * Number of attempts made for the quiz.
 *
 * @param {object} state
 *
 * @return {number}
 */
const quizAttempts = createSelector(
  [meta],
  (meta) => meta.paperCount
)

/**
 * Number of attempts allowed for the quiz.
 *
 * @param {object} state
 *
 * @return {number}
 */
const quizMaxAttempts = createSelector(
  [parameters],
  (parameters) => parameters.maxPapers
)

/**
 * Checks if the max attempts of the quiz is reached.
 *
 * @param {object} state
 *
 * @return {boolean}
 */
const quizMaxAttemptsReached = createSelector(
  [quizMaxAttempts, quizAttempts],
  (quizMaxAttempts, quizAttempts) => 0 < quizMaxAttempts && quizAttempts >= quizMaxAttempts
)

/**
 * Number of attempts made for the quiz by the current user.
 *
 * @param state
 *
 * @return {number}
 */
const userAttempts = createSelector(
  [meta],
  (meta) => meta.userPaperCount
)

/**
 * Number of attempts allowed for a user.
 *
 * @param {object} state
 *
 * @return {number}
 */
const userMaxAttempts = createSelector(
  [parameters],
  (parameters) => parameters.maxAttempts
)

/**
 * Checks if the max attempts of the current user is reached.
 *
 * @param {object} state
 *
 * @return {boolean}
 */
const userMaxAttemptsReached = createSelector(
  [userMaxAttempts, userAttempts],
  (userMaxAttempts, userAttempts) => 0 < userMaxAttempts && userAttempts >= userMaxAttempts
)

/**
 * Number of attempts made for the quiz by the current user today.
 *
 * @param state
 *
 * @return {number}
 */
const userTodayAttempts = createSelector(
  [meta],
  (meta) => meta.userPaperDayCount
)

/**
 * Number of attempts allowed for a user.
 *
 * @param {object} state
 *
 * @return {number}
 */
const userMaxAttemptsPerDay = createSelector(
  [parameters],
  (parameters) => parameters.maxAttemptsPerDay
)

/**
 * Checks if the max attempts per day of the current user is reached.
 *
 * @param {object} state
 *
 * @return {boolean}
 */
const userMaxAttemptsPerDayReached = createSelector(
  [userMaxAttemptsPerDay, userTodayAttempts],
  (userMaxAttemptsPerDay, userTodayAttempts) => 0 < userMaxAttemptsPerDay && userTodayAttempts >= userMaxAttemptsPerDay
)

/**
 * Checks if the current user can start (or restart) the quiz.
 *
 * @param {object} state
 *
 * @return {boolean}
 */
const startEnabled = createSelector(
  [empty, quizMaxAttemptsReached, userMaxAttemptsReached, userMaxAttemptsPerDayReached],
  (empty, quizMaxAttemptsReached, userMaxAttemptsReached, userMaxAttemptsPerDayReached) =>
    !empty && !quizMaxAttemptsReached && !userMaxAttemptsReached && !userMaxAttemptsPerDayReached
)

export default {
  id,
  quiz,
  steps,
  items,
  empty,
  hasPapers,
  hasUserPapers,
  papersAdmin,
  docimologyAdmin,
  registered,
  description,
  meta,
  parameters,
  title,
  viewMode,
  saveEnabled,
  editorOpened,
  noItems,
  firstStepId,
  hasOverview,
  testMode,
  quizNumbering,
  papersShowExpectedAnswers,
  papersShowStatistics,
  allPapersStatistics,
  quizAttempts,
  quizMaxAttempts,
  quizMaxAttemptsReached,
  userAttempts,
  userMaxAttempts,
  userMaxAttemptsReached,
  userTodayAttempts,
  userMaxAttemptsPerDay,
  userMaxAttemptsPerDayReached,
  startEnabled
}
