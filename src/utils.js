import { map, curry } from 'lodash/fp'

export const _map = map.convert({
  cap: false,
})

export const _keyEq = curry((key, value, obj) => obj[key] === value)
