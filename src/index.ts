import { FixWidth } from './fixWidth'
import Factory from './factory'

export { Factory, FixWidth }

export const U256 = new Factory(256)
export const U160 = new Factory(160)
export const U128 = new Factory(128)
export const U64 = new Factory(64)
export const Address = new Factory(160, 160)
