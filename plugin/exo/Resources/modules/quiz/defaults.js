import {
  QUIZ_SUMMATIVE,
  QUIZ_PICKING_DEFAULT,
  SHUFFLE_NEVER,
  SHOW_CORRECTION_AT_VALIDATION,
  SHOW_SCORE_AT_CORRECTION,
  SCORE_SUM
} from './enums'

const quiz = {
  description: '',
  parameters: {
    type: QUIZ_SUMMATIVE,
    showMetadata: true,
    duration: 0,
    maxAttempts: 0,
    maxAttemptsPerDay: 0,
    mandatoryQuestions: false,
    maxPapers: 0,
    interruptible: false,
    showCorrectionAt: SHOW_CORRECTION_AT_VALIDATION,
    correctionDate: '',
    anonymizeAttempts: false,
    showScoreAt: SHOW_SCORE_AT_CORRECTION,
    showStatistics: false,
    showFullCorrection: true,
    showEndConfirm: true,
    endMessage: ''
  },
  picking: {
    type: QUIZ_PICKING_DEFAULT,
    pick: 0,
    randomOrder: SHUFFLE_NEVER,
    randomPick: SHUFFLE_NEVER
  }
}

const step = {
  title: '',
  description: '',
  parameters: {
    maxAttempts: 0,
    maxAttemptsPerDay: 0
  },
  picking: {
    randomOrder: SHUFFLE_NEVER,
    randomPick: SHUFFLE_NEVER,
    pick: 0
  },
  items: []
}

const item = {
  title: '',
  description: '',
  meta: {
    protectQuestion: false,
    mandatory: false
  },
  rights: {
    edit: true
  },
  hints: [],
  feedback: '',
  objects: [],
  score: {
    type: SCORE_SUM,
    success: 1,
    failure: 0
  },
  tags: []
}

const hint = {
  value: '',
  penalty: 0
}

const answer = {
  tries: 0,
  usedHints: [],
  data: undefined
}

export default {
  quiz,
  step,
  item,
  hint,
  answer
}
