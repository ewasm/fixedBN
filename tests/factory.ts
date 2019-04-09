import * as tape from 'tape'
import BN = require('bn.js')
import { U64, U256 } from '../src'
import { padHexToLength } from './utils'

tape('Factory types', (t: tape.Test) => {
  t.test('should instantiate from number', (st: tape.Test) => {
    const n = U256.fromNumber(5)
    st.equal(n.width, 256)
    st.equal(n.toNumber(), 5)
    st.end()
  })

  t.test('should instantiate from BN', (st: tape.Test) => {
    // (2 ** 64) - 1
    const hex = 'ffffffffffffffff'
    const bn = new BN(hex, 16)
    const n = U256.fromBN(bn)
    st.equal(n.width, 256)
    st.equal(n.toString(), padHexToLength(hex, 256))
    st.end()
  })

  t.test('should instantiate from string', (st: tape.Test) => {
    const hex = 'ffffffffffffffff'
    const n = U256.fromString(hex)
    st.equal(n.toString(), padHexToLength(hex, 256))
    st.end()
  })

  t.test('should instantiate from buffer', (st: tape.Test) => {
    const hex = 'ffffffffffffffff'
    const buf = Buffer.from([255, 255, 255, 255, 255, 255, 255, 255])
    const n = U64.fromBuffer(buf)
    st.equal(n.toString(), padHexToLength(hex, 64))
    st.end()
  })

  t.test('should throw on instantiating when value exceeds width', (st: tape.Test) => {
    // (2 ** 72) - 1
    const hex = 'ffffffffffffffffff'
    const buf = Buffer.from(hex, 'hex')
    const bn = new BN(hex, 16)
    st.throws(() => U64.fromBN(bn))
    st.throws(() => U64.fromString(hex))
    st.throws(() => U64.fromBuffer(buf))
    st.end()
  })
})
