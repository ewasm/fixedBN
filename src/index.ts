import BN = require('bn.js')
const stripHexPrefix = require('strip-hex-prefix')
const isHexPrefixed = require('is-hex-prefixed')

export type Endianness = 'le' | 'be'

/**
 * Convenience class for creating FixedWidthBN values
 * with the same width.
 */
export class Factory {
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

class FixWidth extends BN {
  _maxWidth: number
  _minWidth: number

  constructor(value: any, maxWidth: number, minWidth: number = 0) {
    // bn.js still doesn't support hex prefixes...
    if (typeof value === 'string' && isHexPrefixed(value)) {
      super(stripHexPrefix(value), 16)
    } else {
      super(value, 10)
    }

    if (this.byteLength() * 8 > maxWidth) {
      throw Error(`number must be less then ${maxWidth} bits`)
    }

    if (this.byteLength() * 8 < minWidth) {
      throw new Error(`number must be more then ${minWidth} bits`)
    }
    this._maxWidth = maxWidth
    this._minWidth = minWidth
  }

  /**
   * converts a buffer to a fixed-bn.js
   * @param {string | integer} value
   * @param {string} endain
   */
  static fromBuffer(value: any, endian: Endianness = 'be', maxWidth: number, minWidth: number = 0) {
    const bn = new BN(value, 10, endian)
    return new FixWidth(bn, maxWidth, minWidth)
  }

  /**
   * checks if a BN instance is a fixed BN instance
   * @param {bn.js} bn
   */
  static isFixBN(bn: BN): boolean {
    return bn.hasOwnProperty('_minWidth') && bn.hasOwnProperty('_maxWidth')
  }

  /**
   * retuns Max Width
   * @returns {integer}
   */
  get maxWidth() {
    return this._maxWidth
  }

  /**
   * retuns Min Width
   * @returns {integer}
   */
  get minWidth() {
    return this._minWidth
  }

  // This assumes Uint8Array in LSB (WASM code)
  toBuffer(endian: Endianness = 'be') {
    return super.toBuffer(endian, this._maxWidth / 8)
  }

  toArray(endian: Endianness) {
    return super.toArray(endian, this._maxWidth / 8)
  }

  toArrayLike(_type: any, endian: Endianness): any {
    return super.toArrayLike(_type, endian, this._maxWidth / 8)
  }

  /**
   * checks if a fixed-bn instance is the same width as the contructor
   * @param {bn.js} fixBN
   */
  isSameWidth(fixBN: FixWidth): boolean {
    return this._minWidth === fixBN.minWidth && this._maxWidth === fixBN.maxWidth
  }
}

export const U256 = new Factory(256)
export const U160 = new Factory(160)
export const U128 = new Factory(128)
export const U64 = new Factory(64)
export const Address = new Factory(160, 160)
