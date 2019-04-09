[fixed-bn.js](../README.md) > [Factory](../classes/factory.md)

# Class: Factory

Convenience class for creating FixedWidthBN values with the same width.

## Hierarchy

**Factory**

## Index

### Constructors

* [constructor](factory.md#constructor)

### Properties

* [width](factory.md#width)

### Methods

* [fromBN](factory.md#frombn)
* [fromBuffer](factory.md#frombuffer)
* [fromNumber](factory.md#fromnumber)
* [fromString](factory.md#fromstring)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Factory**(width: *`number`*): [Factory](factory.md)

*Defined in [factory.ts:9](https://github.com/ewasm/fixed-bn.js/blob/master/src/factory.ts#L9)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| width | `number` |

**Returns:** [Factory](factory.md)

___

## Properties

<a id="width"></a>

###  width

**● width**: *`number`*

*Defined in [factory.ts:9](https://github.com/ewasm/fixed-bn.js/blob/master/src/factory.ts#L9)*

___

## Methods

<a id="frombn"></a>

###  fromBN

▸ **fromBN**(value: *`BN`*): [FixedWidthBN](fixedwidthbn.md)

*Defined in [factory.ts:19](https://github.com/ewasm/fixed-bn.js/blob/master/src/factory.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `BN` |

**Returns:** [FixedWidthBN](fixedwidthbn.md)

___
<a id="frombuffer"></a>

###  fromBuffer

▸ **fromBuffer**(value: *`Buffer`*, endian?: *[Endianness](../#endianness)*): [FixedWidthBN](fixedwidthbn.md)

*Defined in [factory.ts:27](https://github.com/ewasm/fixed-bn.js/blob/master/src/factory.ts#L27)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| value | `Buffer` | - |
| `Default value` endian | [Endianness](../#endianness) | &quot;be&quot; |

**Returns:** [FixedWidthBN](fixedwidthbn.md)

___
<a id="fromnumber"></a>

###  fromNumber

▸ **fromNumber**(value: *`number`*): [FixedWidthBN](fixedwidthbn.md)

*Defined in [factory.ts:15](https://github.com/ewasm/fixed-bn.js/blob/master/src/factory.ts#L15)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `number` |

**Returns:** [FixedWidthBN](fixedwidthbn.md)

___
<a id="fromstring"></a>

###  fromString

▸ **fromString**(value: *`string`*, base?: *`number`*): [FixedWidthBN](fixedwidthbn.md)

*Defined in [factory.ts:23](https://github.com/ewasm/fixed-bn.js/blob/master/src/factory.ts#L23)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| value | `string` | - |
| `Default value` base | `number` | 16 |

**Returns:** [FixedWidthBN](fixedwidthbn.md)

___

