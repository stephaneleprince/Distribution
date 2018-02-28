import {API_REQUEST} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/api/router'

export const actions = {}

actions.updateProgression = (step, status = 'seen') => ({
  [API_REQUEST]: {
    url: generateUrl('innova_path_step_progression_update', {id: step.id}),
    request: {
      method: 'PUT',
      body: JSON.stringify({status: status})
    },
    success: (data) => {
      console.log(data)
    }
  }
})
