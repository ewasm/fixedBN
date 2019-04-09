const assert = require('assert')
const stripHexPrefix = require('strip-hex-prefix')
const isHexPrefixed = require('is-hex-prefixed')
import BN = require('bn.js')

export type Endianness = 'le' | 'be'

/**
 * A [BN](https://github.com/indutny/bn.js) wrapper that limits numbers to
 * a fixed width. The width should be a factor of 8, and the number is limited
 * to be only unsigned currently.
 */
export class FixedWidthBN {
  _width: number
  _bn: BN
  _modulus: BN

  /**
   * Instantiate a FixedWidthBN given width and a number value.
   * @param width - Width of number in number of bits
   * @param value - Value
   * @throws if width < 1
   * @throws if width % 8 !== 0
   */
  constructor(width: number, value: number = 0) {
    assert(width >= 1, 'Invalid width')
    assert(width % 8 === 0, 'Width should be divisible by 8')
    this._width = width
    this._bn = new BN(value)
    // 2 ** width
    // Used for taking modulo, e.g. after addMod, mulMod
    this._modulus = new BN(2).pow(new BN(this._width))
  }

  /**
   * Instantiates from a BN object.
   * @param width - Width in number of bits
   * @param value - Value
   * @throws if value is not a BN
   * @throws if BN value is larger than the given width
   * @throws if value is negative
   */
  static fromBN(width: number, value: BN): FixedWidthBN {
    assert(BN.isBN(value), 'Value should be BN')
    assert(value.bitLength() <= width, 'Value exceeds width')
    assert(!value.isNeg(), 'Value should be positive')

    const n = new FixedWidthBN(width, 0)
    n._width = width
    n._bn = value

    return n
  }

  /**
   * Instantiates from a string. It strips `0x` from beginning
   * of strings.
   * @param width - Width in number of bits
   * @param value - Encoded value
   * @param base - Base in which number is encoded
   * @throws if value is not a string
   * @throws if value is larger than the given width
   */
  static fromString(width: number, value: string, base: number = 16): FixedWidthBN {
    assert(typeof value === 'string')
    if (isHexPrefixed(value)) {
      value = stripHexPrefix(value)
    }

    const bn = new BN(value, base)
    return FixedWidthBN.fromBN(width, bn)
  }

  /**
   * Instantiates from a buffer.
   * @param width - Width in number of bits
   * @param value - Value
   * @param endian - Endianness of number
   * @throws if vlaue is not a buffer
   * @throws if value is larger than given width
   */
  static fromBuffer(width: number, value: Buffer, endian: Endianness = 'be'): FixedWidthBN {
    assert(Buffer.isBuffer(value))
    const bn = new BN(value, 10, endian)
    return FixedWidthBN.fromBN(width, bn)
  }

  /**
   * Width of number in number of bits. Note that this doesn't
   * necessarily equate the current bit length of the number.
   */
  get width(): number {
    return this._width
  }

  get modulus(): BN {
    return this._modulus
  }

  /**
   * Returns a normal BN from the FixedWidthBN.
   */
  toBN(): BN {
    return this._bn
  }

  /**
   * Returns number as a Buffer.
   * @param endian - Endianness
   */
  toBuffer(endian: Endianness = 'be', pad: boolean = false): Buffer {
    const length = pad ? this._width / 8 : 1
    return this._bn.toBuffer(endian, length)
  }

  /**
   * Returns number as an array.
   * @param endian - Endianness
   */
  toArray(endian: Endianness = 'be', pad: boolean = false): number[] {
    const length = pad ? this._width / 8 : 1
    return this._bn.toArray(endian, length)
  }

  /**
   * Returns value as a Javascript number (limited to 53 bits).
   * @throws if bit length of value is larger than 53
   */
  toNumber(): number {
    assert(this._bn.bitLength() <= 53)
    return this._bn.toNumber()
  }

  /**
   * Returns value encoded as a string (without `0x` prefix for base 16).
   * @param base - Base for encoding (e.g. 16 for hex)
   * @param pad - Pad output string to width (only for bases 2 and 16)
   */
  toString(base: number = 16, pad: boolean = true): string {
    if (pad && (base !== 2 && base !== 16)) {
      throw new Error('Padding string only supported for bases 2 and 16')
    }

    if (pad) {
      // BN.toString accepts length as number of chars in output string
      // which, e.g. for base 16 is 2 for each byte, and hence: 2 * (bits / 8)
      const length = base === 16 ? this._width / 4 : this._width
      return this._bn.toString(base, length)
    } else {
      return this._bn.toString(base)
    }
  }

  /**
   * Clones value.
   */
  clone(): FixedWidthBN {
    const bn = this._bn.clone()
    return FixedWidthBN.fromBN(this._width, bn)
  }

  /**
   * Returns bit length of value.
   */
  bitLength(): number {
    return this._bn.bitLength()
  }

  /**
   * Returns byte length of value.
   */
  byteLength(): number {
    return this._bn.byteLength()
  }

  /**
   * Returns true if `b` has same width (not bit length) as value.
   */
  hasSameWidth(b: FixedWidthBN): boolean {
    return this._width === b._width
  }

  /**
   * Returns true if number is even.
   */
  isEven(): boolean {
    return this._bn.isEven()
  }

  /**
   * Returns true if number is odd.
   */
  isOdd(): boolean {
    return this._bn.isOdd()
  }

  /**
   * Returns true if number is zero.
   */
  isZero(): boolean {
    return this._bn.isZero()
  }

  /**
   * Compares numbers and returns -1 (a < b), 0 (a == b) or 1 (a > b).
   * @param b - Value to be compared against
   * @throws if `b` has a different width
   */
  cmp(b: FixedWidthBN): number {
    assert(this.hasSameWidth(b))
    return this._bn.cmp(b._bn)
  }

  /**
   * Returns true if value is less than `b`.
   * @param b - Value to be compared against
   * @throws if `b` has a different width
   */
  lt(b: FixedWidthBN): boolean {
    assert(this.hasSameWidth(b))
    return this._bn.lt(b._bn)
  }

  /**
   * Returns true if value is less than or equal to `b`.
   * @param b - Value to be compared against
   * @throws if `b` has a different width
   */
  lte(b: FixedWidthBN): boolean {
    assert(this.hasSameWidth(b))
    return this._bn.lte(b._bn)
  }

  /**
   * Returns true if value is less than `b`.
   * @param b - Value to be compared against
   */
  ltn(b: number): boolean {
    return this._bn.ltn(b)
  }

  /**
   * Returns true if value is less than or equal to `b`.
   * @param b - Value to be compared against
   */
  lten(b: number): boolean {
    return this._bn.lten(b)
  }

  /**
   * Returns true if value is greated than `b`.
   * @param b - Value to be compared against
   * @throws if `b` has a different width
   */
  gt(b: FixedWidthBN): boolean {
    assert(this.hasSameWidth(b))
    return this._bn.gt(b._bn)
  }

  /**
   * Returns true if value is greated than or equal to `b`.
   * @param b - Value to be compared against
   * @throws if `b` has a different width
   */
  gte(b: FixedWidthBN): boolean {
    assert(this.hasSameWidth(b))
    return this._bn.gte(b._bn)
  }

  /**
   * Returns true if value is greated than `b`.
   * @param b - Value to be compared against
   */
  gtn(b: number): boolean {
    return this._bn.gtn(b)
  }

  /**
   * Returns true if value is greated than or equal to `b`.
   * @param b - Value to be compared against
   * @throws if `b` has a different width
   */
  gten(b: number): boolean {
    return this._bn.gten(b)
  }

  /**
   * Returns true if value is equal to `b`.
   * @param b - Value to be compared against
   * @throws if `b` has a different width
   */
  eq(b: FixedWidthBN): boolean {
    assert(this.hasSameWidth(b))
    return this._bn.eq(b._bn)
  }

  /**
   * Returns a new FixedWidthBN computed from adding value with `b`.
   * @param b - Second operand
   * @throws if `b` has a different width
   * @throws if add overflows the width
   */
  add(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.add(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from adding value with `b`.
   * It wraps the result on overflow.
   * @param b - Second operand
   * @throws if `b` has a different width
   */
  addMod(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.add(b._bn).mod(this.modulus)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from subtracting value from `b`.
   * @param b - Second operand
   * @throws if `b` has a different width
   * @throws if sub underflows
   */
  sub(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.sub(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from subtracting value from `b`.
   * It wraps the result on underflow, e.g. if width is 8, `2 - 3 == 255`.
   * @param b - Second operand
   * @throws if `b` has a different width
   */
  subMod(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.sub(b._bn).umod(this.modulus)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from multiplying value with `b`.
   * @param b - Second operand
   * @throws if `b` has a different width
   * @throws if mul overflows
   */
  mul(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.mul(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from multiplying value with `b`.
   * It wraps the result on overflow.
   * @param b - Second operand
   * @throws if `b` has a different width
   */
  mulMod(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.mul(b._bn).mod(this.modulus)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from multiplying value with itself (square of value).
   * @throws if sqr overflows
   */
  sqr(): FixedWidthBN {
    const c = this._bn.sqr()
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from multiplying value with itself (square of value).
   * It wraps the result on overflow.
   */
  sqrMod(): FixedWidthBN {
    const c = this._bn.sqr().mod(this.modulus)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from raising value to power of `b`.
   * @param b - Exponent
   * @throws if `b` has a different width
   * @throws if pow overflows
   */
  pow(b: FixedWidthBN): FixedWidthBN {
    const c = this._bn.pow(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from raising value to power of `b`.
   * It wraps the result on overflow.
   * @param b - Exponent
   * @throws if `b` has a different width
   */
  powMod(b: FixedWidthBN): FixedWidthBN {
    const c = this._bn.pow(b._bn).mod(this.modulus)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from dividing value by `b`.
   * @param b - Divisor
   * @throws if `b` has a different width
   */
  div(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.div(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from value mod b.
   * @param b - Modulus
   * @throws if `b` has a different width
   */
  mod(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.mod(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from applying a bitwise or.
   * @param b - Second operand
   * @throws if `b` has a different width
   */
  or(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.or(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from applying a bitwise and.
   * @param b - Second operand
   * @throws if `b` has a different width
   */
  and(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.and(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from applying a bitwise xor.
   * @param b - Second operand
   * @throws if `b` has a different width
   */
  xor(b: FixedWidthBN): FixedWidthBN {
    assert(this.hasSameWidth(b))
    const c = this._bn.xor(b._bn)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from shifting value to left
   * by a number of bits. It discards bits that are shifted out of width.
   * @param b - Number of bits to shift
   */
  shl(b: number): FixedWidthBN {
    const c = this._bn.shln(b).mod(this.modulus)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Returns a new FixedWidthBN computed from shifting value to right
   * by a number of bits. It discards bits that are shifted out of width.
   * @param b - Number of bits to shift
   */
  shr(b: number): FixedWidthBN {
    const c = this._bn.shrn(b).mod(this.modulus)
    return FixedWidthBN.fromBN(this._width, c)
  }

  /**
   * Tests if a specific bit is set.
   * @param b - Index of bit to test
   */
  test(b: number): boolean {
    return this._bn.testn(b)
  }

  /**
   * Returns a new FixedWidthBN computed from bitwise negation of value.
   */
  not(): FixedWidthBN {
    const c = this._bn.notn(this._width)
    return FixedWidthBN.fromBN(this._width, c)
  }
}
