# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/fixed-bn.js.svg?style=flat-square)](https://www.npmjs.org/package/fixed-bn.js)
[![Build Status](https://img.shields.io/travis/ewasm/fixed-bn.js.svg?branch=master&style=flat-square)](https://travis-ci.org/ewasm/fixed-bn.js)
[![Coverage Status](https://img.shields.io/coveralls/ewasm/fixed-bn.js.svg?style=flat-square)](https://coveralls.io/r/ewasm/fixed-bn.js)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

a bn.js factory wrapper that constrains numbers to a fixed width

# USAGE

```javascript
const FixedBN = require('fixed-bn.js')

// there are some built in sizes `U64`, `U128`, `U160`, `U256`
const bnNum = new FixedBN.U64('0x5555555')
// use normal bn.js methods
bnNum.iaddn(55)

// toBuffer and toArray allways produces a fixed length result
bnNum.toBuffer()
// <Buffer 00 00 00 00 05 55 55 55>

// you can also create an arbitary fixed lenght bn
// max bit lenght is 199 bits and min length is 2 bits
const I199 = FixedBN(199, 2)
const newBnNum = new I199(390248)
```

# API

Since this module extends [BN.js](https://github.com/indutny/bn.js/) it has the methods as it does plus a few extras.

## factory

[./index.js:11-87](https://github.com/ewasm/fixedBN/blob/814e88711940f48efc341ed0c1296f7fa6cdd111/./index.js#L11-L87 'Source code on GitHub')

A factory that produces BN.js constructors for a given width

**Parameters**

- `maxWidth` **Integer** the max length in bits that the bn.js instance can handle
- `minWidth` **Integer** the min length in bits that the bn.js instance can handle

Returns **bn.js** returns a bn.js constuctor that that is constained to `maxWidth` and `minWidth`

## builtin length

the factory has the following builtins

- `FixedBN.U64`
- `FixedBN.U128`
- `FixedBN.U160`
- `FixedBN.U256`

## bn.js instance

Each instance has the following additional methods

## maxWidth

[./index.js:35-37](https://github.com/ewasm/fixedBN/blob/814e88711940f48efc341ed0c1296f7fa6cdd111/./index.js#L35-L37 'Source code on GitHub')

retuns Max Width

Returns **integer**

## minWidth

[./index.js:43-45](https://github.com/ewasm/fixedBN/blob/814e88711940f48efc341ed0c1296f7fa6cdd111/./index.js#L43-L45 'Source code on GitHub')

retuns Min Width

Returns **integer**

## fromBuffer

[./index.js:66-68](https://github.com/ewasm/fixedBN/blob/814e88711940f48efc341ed0c1296f7fa6cdd111/./index.js#L66-L68 'Source code on GitHub')

converts a buffer to a fixed-bn.js

**Parameters**

- `value` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | integer)**
- `endain` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**
- `endian` (optional, default `'be'`)

## isFixBN

[./index.js:74-76](https://github.com/ewasm/fixedBN/blob/814e88711940f48efc341ed0c1296f7fa6cdd111/./index.js#L74-L76 'Source code on GitHub')

checks if a BN instance is a fixed BN instance

**Parameters**

- `bn` **bn.js**

## isSameWidth

[./index.js:82-84](https://github.com/ewasm/fixedBN/blob/814e88711940f48efc341ed0c1296f7fa6cdd111/./index.js#L82-L84 'Source code on GitHub')

checks if a fixed-bn instance is the same width as the contructor

**Parameters**

- `fixBN` **bn.js**

# LICENSE

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)
