import {createSelector} from 'reselect'
import {select as formSelect} from '#/main/core/data/form/selectors'

const formName = 'pathForm'
const form =  state => formSelect.form(state, formName)

const currentSection = createSelector(
  [form],
  (form) => form.currentSection
)

export const select = {
  currentSection
}
