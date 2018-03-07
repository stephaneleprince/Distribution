
import {ColorGroup} from '#/main/core/layout/form/components/group/color-group'

const COLOR_TYPE = 'color'

const colorDefinition = {
  meta: {
    type: COLOR_TYPE
  },
  validate: (value) => typeof value === 'string',
  components: {
    form: ColorGroup
  }
}

export {
  COLOR_TYPE,
  colorDefinition
}
