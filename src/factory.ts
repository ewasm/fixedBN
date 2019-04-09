import BN = require('bn.js')
import { FixedWidthBN, Endianness } from './fixed-width'

/**
 * Convenience class for creating FixedWidthBN values
 * with the same width.
 */
export class Factory {
  width: number

  constructor(width: number) {
    this.width = width
  }

  fromNumber(value: number): FixedWidthBN {
    return new FixedWidthBN(this.width, value)
  }

  fromBN(value: BN): FixedWidthBN {
    return FixedWidthBN.fromBN(this.width, value)
  }

  fromString(value: string, base: number = 16): FixedWidthBN {
    return FixedWidthBN.fromString(this.width, value, base)
  }

  fromBuffer(value: Buffer, endian: Endianness = 'be'): FixedWidthBN {
    return FixedWidthBN.fromBuffer(this.width, value, endian)
  }
}
