import BN = require('bn.js')
import { FixWidth, Endianness } from './fixWidth'

/**
 * Convenience class for creating FixedWidthBN values
 * with the same width.
 */
export default class Factory {
  maxWidth: number
  minWidth: number

  constructor(maxWidth: number, minWidth: number = 0) {
    this.maxWidth = maxWidth
    this.minWidth = minWidth
  }

  fromNumber(value: number): FixWidth {
    return new FixWidth(value, this.maxWidth, this.minWidth)
  }

  fromBN(value: BN): FixWidth {
    return new FixWidth(value, this.maxWidth, this.minWidth)
  }

  fromString(value: string): FixWidth {
    return new FixWidth(value, this.maxWidth, this.minWidth)
  }

  fromBuffer(value: Buffer, endian: Endianness = 'be'): FixWidth {
    return FixWidth.fromBuffer(value, endian, this.maxWidth, this.minWidth)
  }
}
