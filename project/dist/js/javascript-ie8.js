(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
require('html5shiv/dist/html5shiv.js');
require('respond.js/dest/respond.src.js');
require('javascript-magic/js/plugins/PIE_IE678.js');

}).call(this,require("p8eFRy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_6ebf2876.js","/")
},{"buffer":3,"html5shiv/dist/html5shiv.js":4,"javascript-magic/js/plugins/PIE_IE678.js":6,"p8eFRy":7,"respond.js/dest/respond.src.js":8}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("p8eFRy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/base64-js/lib/b64.js","/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/base64-js/lib")
},{"buffer":3,"p8eFRy":7}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("p8eFRy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/buffer/index.js","/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/buffer")
},{"base64-js":2,"buffer":3,"ieee754":5,"p8eFRy":7}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
* @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.7.3-pre';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  if(typeof module == 'object' && module.exports){
    module.exports = html5;
  }

}(typeof window !== "undefined" ? window : this, document));

}).call(this,require("p8eFRy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/html5shiv/dist/html5shiv.js","/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/html5shiv/dist")
},{"buffer":3,"p8eFRy":7}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("p8eFRy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/ieee754/index.js","/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/ieee754")
},{"buffer":3,"p8eFRy":7}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
(function(O,H){var h=O.PIE||(O.PIE={});h.Fa=function(a){var b,d,e,c,g=arguments;b=1;for(d=g.length;b<d;b++){c=g[b];for(e in c)if(c.hasOwnProperty(e))a[e]=c[e]}return a};h.Fa(h,{z:"-pie-",qb:"Pie",Na:"pie_",uc:{TD:1,TH:1},Tb:{TABLE:1,THEAD:1,TBODY:1,TFOOT:1,TR:1,INPUT:1,TEXTAREA:1,SELECT:1,OPTION:1,IMG:1,HR:1},Zb:{A:1,INPUT:1,TEXTAREA:1,SELECT:1,BUTTON:1},Hd:{submit:1,button:1,reset:1},pd:function(){}});try{H.execCommand("BackgroundImageCache",false,true)}catch(ca){}(function(){for(var a=4,b=H.createElement("div"),
d=b.getElementsByTagName("i");b.innerHTML="<!--[if gt IE "+ ++a+"]><i></i><![endif]--\>",d[0];);h.U=a;if(a===6)h.z=h.z.replace(/^-/,"");h.qa=H.documentMode||h.U;b.innerHTML='<v:shape adj="1"/>';a=b.firstChild;a.style.behavior="url(#default#VML)";h.tc=typeof a.adj==="object"})();(function(){var a=0,b={};h.Q={pa:function(d){return d&&d._pieId||(d._pieId="_"+a++)},Ac:function(d,e,c){var g=b[d],i,j;if(g)Object.prototype.toString.call(g)==="[object Array]"?g.push([e,c]):e.call(c,g);else{j=b[d]=[[e,c]];
i=new Image;i.onload=function(){g=b[d]={f:i.width,e:i.height};for(var f=0,k=j.length;f<k;f++)j[f][0].call(j[f][1],g);i.onload=null};i.src=d}}}})();h.nb={ge:{top:0,right:90,bottom:180,left:270},xd:function(a,b,d,e){a=e.la;e=e.ab;var c;if(a)a=a.jd();else if(e)if(e[1]){a=e[0]=="top"||e[1]=="top"?b:-b;e=e[0]=="left"||e[1]=="left"?-d:d;a=Math.atan2(e,a)*180/Math.PI}else a=this.ge[e[0]];else a=180;for(;a<0;)a+=360;a%=360;c=h.nb.Od(b/2,d/2,a,a>=180?0:b,a<90||a>270?0:d);e=c[0];c=c[1];b=b-e;d=d-c;return{la:a,
qd:e,rd:c,ae:b,be:d,Jd:h.nb.ld(b,d,e,c)}},Od:function(a,b,d,e,c){if(d===0||d===180)return[a,c];else if(d===90||d===270)return[e,b];else{d=Math.tan((d-90)*Math.PI/180);a=d*a-b;b=-1/d;e=b*e-c;c=b-d;return[(e-a)/c,(d*e-b*a)/c]}},ld:function(a,b,d,e){a=d-a;b=e-b;return Math.abs(a===0?b:b===0?a:Math.sqrt(a*a+b*b))}};h.ja=function(){this.Eb=[];this.hc={}};h.ja.prototype={ca:function(a){var b=h.Q.pa(a),d=this.hc,e=this.Eb;if(!(b in d)){d[b]=e.length;e.push(a)}},Ka:function(a){a=h.Q.pa(a);var b=this.hc;if(a&&
a in b){delete this.Eb[b[a]];delete b[a]}},Da:function(){for(var a=this.Eb,b=a.length;b--;)a[b]&&a[b]()}};h.Pa=new h.ja;h.Pa.Ud=function(){var a=this,b;if(!a.Vd){b=H.documentElement.currentStyle.getAttribute(h.z+"poll-interval")||250;(function d(){a.Da();setTimeout(d,b)})();a.Vd=1}};(function(){function a(){h.J.Da();O.detachEvent("onunload",a);O.PIE=null}h.J=new h.ja;O.attachEvent("onunload",a);h.J.za=function(b,d,e){b.attachEvent(d,e);this.ca(function(){b.detachEvent(d,e)})}})();h.Sa=new h.ja;h.J.za(O,
"onresize",function(){h.Sa.Da()});(function(){function a(){h.pb.Da()}h.pb=new h.ja;h.J.za(O,"onscroll",a);h.Sa.ca(a)})();(function(){function a(){d=h.mb.kd()}function b(){if(d){for(var e=0,c=d.length;e<c;e++)h.attach(d[e]);d=0}}var d;h.J.za(O,"onbeforeprint",a);h.J.za(O,"onafterprint",b)})();h.ob=new h.ja;h.J.za(H,"onmouseup",function(){h.ob.Da()});h.Qa=function(){function a(f){this.ha=f}var b=H.createElement("length-calc"),d=H.body||H.documentElement,e=b.style,c={},g=["mm","cm","in","pt","pc"],i=
g.length,j={};e.position="absolute";e.top=e.left="-9999px";for(d.appendChild(b);i--;){e.width="100"+g[i];c[g[i]]=b.offsetWidth/100}d.removeChild(b);e.width="1em";a.prototype={Fb:/(px|em|ex|mm|cm|in|pt|pc|%)$/,dc:function(){var f=this.Md;if(f===void 0)f=this.Md=parseFloat(this.ha);return f},Ab:function(){var f=this.he;if(!f)f=this.he=(f=this.ha.match(this.Fb))&&f[0]||"px";return f},a:function(f,k){var l=this.dc(),m=this.Ab();switch(m){case "px":return l;case "%":return l*(typeof k==="function"?k():
k)/100;case "em":return l*this.yb(f);case "ex":return l*this.yb(f)/2;default:return l*c[m]}},yb:function(f){var k=f.currentStyle.fontSize,l,m;if(k.indexOf("px")>0)return parseFloat(k);else if(f.tagName in h.Tb){m=this;l=f.parentNode;return h.m(k).a(l,function(){return m.yb(l)})}else{f.appendChild(b);k=b.offsetWidth;b.parentNode===f&&f.removeChild(b);return k}}};a.gb=function(f){return f/c.pt};h.m=function(f){return j[f]||(j[f]=new a(f))};return a}();h.kb=function(){function a(c){this.ga=c}var b=h.m("50%"),
d={top:1,center:1,bottom:1},e={left:1,center:1,right:1};a.prototype={Bd:function(){if(!this.Rb){var c=this.ga,g=c.length,i=h.q,j=i.ya,f=h.m("0");j=j.W;f=["left",f,"top",f];if(g===1){c.push(new i.rb(j,"center"));g++}if(g===2){j&(c[0].h|c[1].h)&&c[0].c in d&&c[1].c in e&&c.push(c.shift());if(c[0].h&j)if(c[0].c==="center")f[1]=b;else f[0]=c[0].c;else if(c[0].G())f[1]=h.m(c[0].c);if(c[1].h&j)if(c[1].c==="center")f[3]=b;else f[2]=c[1].c;else if(c[1].G())f[3]=h.m(c[1].c)}this.Rb=f}return this.Rb},coords:function(c,
g,i){var j=this.Bd(),f=j[1].a(c,g);c=j[3].a(c,i);return{x:j[0]==="right"?g-f:f,y:j[2]==="bottom"?i-c:c}}};return a}();h.Ma=function(){function a(b,d){this.f=b;this.e=d}a.prototype={a:function(b,d,e,c,g){var i=this.f,j=this.e,f=d/e;c=c/g;if(i==="contain"){i=c>f?d:e*c;j=c>f?d/c:e}else if(i==="cover"){i=c<f?d:e*c;j=c<f?d/c:e}else if(i==="auto"){j=j==="auto"?g:j.a(b,e);i=j*c}else{i=i.a(b,d);j=j==="auto"?i/c:j.a(b,e)}return{f:i,e:j}}};a.Jc=new a("auto","auto");return a}();h.Cc=function(){function a(b){this.ha=
b}a.prototype={Fb:/[a-z]+$/i,Ab:function(){return this.Wc||(this.Wc=this.ha.match(this.Fb)[0].toLowerCase())},jd:function(){var b=this.Rc,d;if(b===undefined){b=this.Ab();d=parseFloat(this.ha,10);b=this.Rc=b==="deg"?d:b==="rad"?d/Math.PI*180:b==="grad"?d/400*360:b==="turn"?d*360:0}return b}};return a}();h.Ic=function(){function a(f,k,l){if(l<0)l+=1;else if(l>1)l-=1;return 255*(6*l<1?f+(k-f)*l*6:2*l<1?k:3*l<2?f+(k-f)*(2/3-l)*6:f)}function b(f){this.ha=f}var d={};b.Td=/\s*rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(\d+|\d*\.\d+))?\s*\)\s*/;
b.Fd=/\s*hsla?\(\s*(\d*\.?\d+)\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(,\s*(\d+|\d*\.\d+))?\s*\)\s*/;b.db={};for(var e="black|0|navy|3k|darkblue|b|mediumblue|1u|blue|1e|darkgreen|jk1|green|5j4|teal|3k|darkcyan|26j|deepskyblue|ad0|darkturquoise|2xe|mediumspringgreen|8nd|lime|va|springgreen|3j|aqua|3k|cyan|0|midnightblue|xunl|dodgerblue|7ogf|lightseagreen|2zsb|forestgreen|2lbs|seagreen|guut|darkslategray|12pk|limegreen|4wkj|mediumseagreen|dwlb|turquoise|5v8f|royalblue|r2p|steelblue|75qr|darkslateblue|2fh3|mediumturquoise|ta9|indigo|32d2|darkolivegreen|emr1|cadetblue|ebu9|cornflowerblue|6z4d|mediumaquamarine|3459|dimgray|3nwf|slateblue|1bok|olivedrab|1opi|slategray|6y5p|lightslategray|9vk9|mediumslateblue|5g0l|lawngreen|27ma|chartreuse|48ao|aquamarine|5w|maroon|18|purple|3k|olive|p6o|gray|3k|lightslateblue|5j7j|skyblue|4q98|lightskyblue|f|blueviolet|3bhk|darkred|15we|darkmagenta|3v|saddlebrown|djc|darkseagreen|69vg|lightgreen|1og1|mediumpurple|3ivc|darkviolet|sfv|palegreen|6zt1|darkorchid|awk|yellowgreen|292e|sienna|7r3v|brown|6sxp|darkgray|6bgf|lightblue|5vlp|greenyellow|7k9|paleturquoise|2pxb|lightsteelblue|169c|powderblue|5jc|firebrick|1rgc|darkgoldenrod|8z55|mediumorchid|2jm0|rosybrown|34jg|darkkhaki|1mfw|silver|49jp|mediumvioletred|8w5h|indianred|8tef|peru|82r|violetred|3ntd|feldspar|212d|chocolate|16eh|tan|ewe|lightgrey|1kqv|palevioletred|6h8g|metle|fnp|orchid|2dj2|goldenrod|abu|crimson|20ik|gainsboro|13mo|plum|12pt|burlywood|1j8q|lightcyan|3794|lavender|8agr|darksalmon|3rsw|violet|6wz8|palegoldenrod|k3g|lightcoral|28k6|khaki|k5o|aliceblue|3n7|honeydew|1dd|azure|f|sandybrown|5469|wheat|1q37|beige|4kp|whitesmoke|p|mintcream|1z9|ghostwhite|46bp|salmon|25bn|antiquewhite|l7p|linen|zz|lightgoldenrodyellow|1yk|oldlace|46qc|red|1gka|magenta|73|fuchsia|0|deeppink|3v8|orangered|9kd|tomato|5zb|hotpink|19p|coral|49o|darkorange|2i8|lightsalmon|41m|orange|w6|lightpink|3i9|pink|1ze|gold|4dx|peachpuff|qh|navajowhite|s4|moccasin|16w|bisque|f|mistyrose|t|blanchedalmond|1d8|papayawhip|so|lavenderblush|80|seashell|zd|cornsilk|ku|lemonchiffon|dt|floralwhite|z|snow|a|yellow|sm|lightyellow|68|ivory|g|white|f".split("|"),
c=0,g=e.length,i=0,j;c<g;c+=2){i+=parseInt(e[c+1],36);j=i.toString(16);b.db[e[c]]="#000000".slice(0,-j.length)+j}b.prototype={parse:function(){if(!this.tb){var f=this.ha,k;if(k=f.match(b.Td)){f=this.rc(+k[1],+k[2],+k[3]);k=k[5]?+k[5]:1}else if(k=f.match(b.Fd)){var l=k[1],m=k[2],o=k[3],s,q;f=Math.round;m/=100;o/=100;if(m){m=o<=0.5?o*(m+1):o+m-o*m;s=o*2-m;l=l%360/360;o=a(s,m,l+1/3);q=a(s,m,l);l=a(s,m,l-1/3)}else o=q=l=o*255;f={Rd:f(o),td:f(q),Zc:f(l)};f=this.rc(f.Rd,f.td,f.Zc);k=k[5]?+k[5]:1}else{if(b.db.hasOwnProperty(k=
f.toLowerCase()))f=b.db[k];k=f==="transparent"?0:1}this.tb=f;this.Qc=k}},rc:function(f,k,l){return"#"+(f<16?"0":"")+f.toString(16)+(k<16?"0":"")+k.toString(16)+(l<16?"0":"")+l.toString(16)},M:function(f){this.parse();return this.tb==="currentColor"?h.aa(f.currentStyle.color).M(f):this.tb},Y:function(){this.parse();return this.Qc}};h.aa=function(f){return d[f]||(d[f]=new b(f))};return b}();h.q=function(){function a(d){this.$a=d;this.ch=0;this.ga=[];this.Ja=0}var b=a.ya={La:1,Lb:2,u:4,Kc:8,Mb:16,W:32,
I:64,wa:128,xa:256,Ta:512,Nc:1024,URL:2048};a.rb=function(d,e){this.h=d;this.c=e};a.rb.prototype={Ea:function(){return this.h&b.I||this.h&b.wa&&this.c==="0"},G:function(){return this.Ea()||this.h&b.Ta}};a.prototype={je:/\s/,Nd:/^[\+\-]?(\d*\.)?\d+/,url:/^url\(\s*("([^"]*)"|'([^']*)'|([!#$%&*-~]*))\s*\)/i,gc:/^\-?[_a-z][\w-]*/i,ce:/^("([^"]*)"|'([^']*)')/,Dd:/^#([\da-f]{6}|[\da-f]{3})/i,ie:{px:b.I,em:b.I,ex:b.I,mm:b.I,cm:b.I,"in":b.I,pt:b.I,pc:b.I,deg:b.La,rad:b.La,grad:b.La},cd:{rgb:1,rgba:1,hsl:1,
hsla:1},next:function(d){function e(o,s){o=new a.rb(o,s);if(!d){k.ga.push(o);k.Ja++}return o}function c(){k.Ja++;return null}var g,i,j,f,k=this;if(this.Ja<this.ga.length)return this.ga[this.Ja++];for(;this.je.test(this.$a.charAt(this.ch));)this.ch++;if(this.ch>=this.$a.length)return c();i=this.ch;g=this.$a.substring(this.ch);j=g.charAt(0);switch(j){case "#":if(f=g.match(this.Dd)){this.ch+=f[0].length;return e(b.u,f[0])}break;case '"':case "'":if(f=g.match(this.ce)){this.ch+=f[0].length;return e(b.Nc,
f[2]||f[3]||"")}break;case "/":case ",":this.ch++;return e(b.xa,j);case "u":if(f=g.match(this.url)){this.ch+=f[0].length;return e(b.URL,f[2]||f[3]||f[4]||"")}}if(f=g.match(this.Nd)){j=f[0];this.ch+=j.length;if(g.charAt(j.length)==="%"){this.ch++;return e(b.Ta,j+"%")}if(f=g.substring(j.length).match(this.gc)){j+=f[0];this.ch+=f[0].length;return e(this.ie[f[0].toLowerCase()]||b.Kc,j)}return e(b.wa,j)}if(f=g.match(this.gc)){j=f[0];this.ch+=j.length;if(j.toLowerCase()in h.Ic.db||j==="currentColor"||j===
"transparent")return e(b.u,j);if(g.charAt(j.length)==="("){this.ch++;if(j.toLowerCase()in this.cd){g=function(o){return o&&o.h&b.wa};f=function(o){return o&&o.h&(b.wa|b.Ta)};var l=function(o,s){return o&&o.c===s},m=function(){return k.next(1)};if((j.charAt(0)==="r"?f(m()):g(m()))&&l(m(),",")&&f(m())&&l(m(),",")&&f(m())&&(j==="rgb"||j==="hsa"||l(m(),",")&&g(m()))&&l(m(),")"))return e(b.u,this.$a.substring(i,this.ch));return c()}return e(b.Mb,j)}return e(b.W,j)}this.ch++;return e(b.Lb,j)},C:function(){return this.ga[this.Ja-- -
2]},all:function(){for(;this.next(););return this.ga},va:function(d,e){for(var c=[],g,i;g=this.next();){if(d(g)){i=true;this.C();break}c.push(g)}return e&&!i?null:c}};return a}();h.Kb=function(a){this.d=a};h.Kb.prototype={X:0,oc:function(){var a=this.ub,b;return!a||(b=this.n())&&(a.x!==b.x||a.y!==b.y)},Yd:function(){var a=this.ub,b;return!a||(b=this.n())&&(a.f!==b.f||a.e!==b.e)},cc:function(){var a=this.d,b=a.getBoundingClientRect(),d=h.qa===9,e=h.U===7,c=b.right-b.left;return{x:b.left,y:b.top,f:d||
e?a.offsetWidth:c,e:d||e?a.offsetHeight:b.bottom-b.top,jc:e&&c?a.offsetWidth/c:1}},n:function(){return this.X?this.Va||(this.Va=this.cc()):this.cc()},Cd:function(){return!!this.ub},cb:function(){++this.X},ib:function(){if(!--this.X){if(this.Va)this.ub=this.Va;this.Va=null}}};(function(){function a(b){var d=h.Q.pa(b);return function(){if(this.X){var e=this.Pb||(this.Pb={});return d in e?e[d]:(e[d]=b.call(this))}else return b.call(this)}}h.p={X:0,ba:function(b){function d(e){this.d=e;this.Ob=this.T()}
h.Fa(d.prototype,h.p,b);d.Vc={};return d},i:function(){var b=this.T(),d=this.constructor.Vc;return b?b in d?d[b]:(d[b]=this.ea(b)):null},T:a(function(){var b=this.d,d=this.constructor,e=b.style;b=b.currentStyle;var c=this.Aa,g=this.Ia,i=d.Tc||(d.Tc=h.z+c);d=d.Uc||(d.Uc=h.qb+g.charAt(0).toUpperCase()+g.substring(1));return e[d]||b.getAttribute(i)||e[g]||b.getAttribute(c)}),j:a(function(){return!!this.i()}),L:a(function(){var b=this.T(),d=b!==this.Ob;this.Ob=b;return d}),oa:a,cb:function(){++this.X},
ib:function(){--this.X||delete this.Pb}}})();h.Hb=h.p.ba({Aa:h.z+"background",Ia:h.qb+"Background",Yc:{scroll:1,fixed:1,local:1},hb:{"repeat-x":1,"repeat-y":1,repeat:1,"no-repeat":1},nc:{"padding-box":1,"border-box":1,"content-box":1},Qd:{top:1,right:1,bottom:1,left:1,center:1},Zd:{contain:1,cover:1},fe:{top:1,bottom:1},Kd:{left:1,right:1},fb:{Oa:"backgroundClip",u:"backgroundColor",ia:"backgroundImage",Ra:"backgroundOrigin",P:"backgroundPosition",ka:"backgroundRepeat",Ua:"backgroundSize"},ea:function(a){function b(r){return r&&
(r.G()&&h.m(r.c)||r.c==="auto"&&"auto")}var d=this.d.currentStyle,e,c,g,i=h.q.ya,j=i.xa,f=i.W,k=i.u,l,m,o=0,s=this.Qd,q,t,n,u,p={R:[]};if(this.xb()){e=new h.q(a);for(g={};c=e.next();){l=c.h;m=c.c;if(!g.V&&l&i.Mb&&m==="linear-gradient"){q={ua:[],V:m};for(t={};c=e.next();){l=c.h;m=c.c;if(l&i.Lb&&m===")"){t.color&&q.ua.push(t);q.ua.length>1&&h.Fa(g,q);break}if(l&k){if(q.la||q.ab){c=e.C();if(c.h!==j)break;e.next()}t={color:h.aa(m)};c=e.next();if(c.G())t.lc=h.m(c.c);else e.C()}else if(l&i.La&&!q.la&&!q.ab&&
!t.color&&!q.ua.length)q.la=new h.Cc(c.c);else if(l&i.W&&m==="to"&&!q.ab&&!q.la&&!t.color&&!q.ua.length){n=this.fe;u=this.Kd;c=e.va(function(r){return!(r&&r.h&i.W&&(r.c in n||r.c in u))});l=c.length;c=[c[0]&&c[0].c,c[1]&&c[1].c];if(l<1||l>2||l>1&&(c[0]in n&&c[1]in n||c[0]in u&&c[1]in u))break;q.ab=c}else if(l&j&&m===","){if(t.color){q.ua.push(t);t={}}}else break}}else if(!g.V&&l&i.URL){g.Cb=m;g.V="image"}else if((c&&c.G()||c.h&f&&c.c in s)&&!g.ma){e.C();g.ma=new h.kb(e.va(function(r){return!(r&&r.G()||
r.h&f&&r.c in s)},false))}else if(l&f)if(m in this.hb&&!g.bb)g.bb=m;else if(m in this.nc&&!g.Ya){g.Ya=m;if((c=e.next())&&c.h&f&&c.c in this.nc)g.Xa=c.c;else{g.Xa=m;e.C()}}else if(m in this.Yc&&!g.$c)g.$c=m;else return null;else if(l&k&&!p.color)p.color=h.aa(m);else if(l&j&&m==="/"&&!g.Za&&g.ma){c=e.next();if(c.h&f&&c.c in this.Zd)g.Za=new h.Ma(c.c);else if(q=b(c)){t=b(e.next());if(!t){t=q;e.C()}g.Za=new h.Ma(q,t)}else return null}else if(l&j&&m===","&&g.V){g.mc=a.substring(o,e.ch-1);o=e.ch;p.R.push(g);
g={}}else return null}if(g.V){g.mc=a.substring(o);p.R.push(g)}p.bd=g.Xa}else this.yc(h.qa<9?function(){var r=this.fb,v=d[r.P+"X"],C=d[r.P+"Y"],y=d[r.ia],B=d[r.u];if(B!=="transparent")p.color=h.aa(B);if(y!=="none")p.R=[{V:"image",Cb:(new h.q(y)).next().c,bb:d[r.ka],ma:new h.kb((new h.q(v+" "+C)).all())}]}:function(){var r=this.fb,v=/\s*,\s*/,C=d[r.ia].split(v),y=d[r.u],B,F,G,K,J,w;if(y!=="transparent")p.color=h.aa(y);if((K=C.length)&&C[0]!=="none"){y=d[r.ka].split(v);B=d[r.P].split(v);F=d[r.Ra].split(v);
G=d[r.Oa].split(v);r=d[r.Ua].split(v);p.R=[];for(v=0;v<K;v++)if((J=C[v])&&J!=="none"){w=r[v].split(" ");p.R.push({mc:J+" "+y[v]+" "+B[v]+" / "+r[v]+" "+F[v]+" "+G[v],V:"image",Cb:(new h.q(J)).next().c,bb:y[v],ma:new h.kb((new h.q(B[v])).all()),Ya:F[v],Xa:G[v],Za:new h.Ma(w[0],w[1])})}}});return p.color||p.R[0]?p:null},yc:function(a){var b=h.qa>8,d=this.fb,e=this.d.runtimeStyle,c=e[d.ia],g=e[d.u],i=e[d.ka],j,f,k,l;if(c)e[d.ia]="";if(g)e[d.u]="";if(i)e[d.ka]="";if(b){j=e[d.Oa];f=e[d.Ra];l=e[d.P];k=
e[d.Ua];if(j)e[d.Oa]="";if(f)e[d.Ra]="";if(l)e[d.P]="";if(k)e[d.Ua]=""}a=a.call(this);if(c)e[d.ia]=c;if(g)e[d.u]=g;if(i)e[d.ka]=i;if(b){if(j)e[d.Oa]=j;if(f)e[d.Ra]=f;if(l)e[d.P]=l;if(k)e[d.Ua]=k}return a},T:h.p.oa(function(){return this.xb()||this.yc(function(){var a=this.d.currentStyle,b=this.fb;return a[b.u]+" "+a[b.ia]+" "+a[b.ka]+" "+a[b.P+"X"]+" "+a[b.P+"Y"]})}),xb:h.p.oa(function(){var a=this.d;return a.style[this.Ia]||a.currentStyle.getAttribute(this.Aa)}),ud:function(a,b,d,e){var c=this.d,
g=b.n();b=g.f;g=g.e;if(a!=="border-box")if((d=d.i())&&(d=d.O)){b-=d.l.a(c)+d.l.a(c);g-=d.t.a(c)+d.b.a(c)}if(a==="content-box")if(a=e.i()){b-=a.l.a(c)+a.l.a(c);g-=a.t.a(c)+a.b.a(c)}return{f:b,e:g}},ic:function(){var a=0;if(h.U<7){a=this.d;a=""+(a.style[h.qb+"PngFix"]||a.currentStyle.getAttribute(h.z+"png-fix"))==="true"}return a},j:h.p.oa(function(){return(this.xb()||this.ic())&&!!this.i()})});h.Jb=h.p.ba({sc:["Top","Right","Bottom","Left"],Ld:{thin:"1px",medium:"3px",thick:"5px"},ea:function(){var a=
{},b={},d={},e=false,c=true,g=true,i=true;this.zc(function(){for(var j=this.d.currentStyle,f=0,k,l,m,o,s,q,t;f<4;f++){m=this.sc[f];t=m.charAt(0).toLowerCase();k=b[t]=j["border"+m+"Style"];l=j["border"+m+"Color"];m=j["border"+m+"Width"];if(f>0){if(k!==o)g=false;if(l!==s)c=false;if(m!==q)i=false}o=k;s=l;q=m;d[t]=h.aa(l);m=a[t]=h.m(b[t]==="none"?"0":this.Ld[m]||m);if(m.a(this.d)>0)e=true}});return e?{O:a,de:b,dd:d,qe:i,ed:c,ee:g}:null},T:h.p.oa(function(){var a=this.d,b=a.currentStyle,d;a.tagName in
h.uc&&a.offsetParent.currentStyle.borderCollapse==="collapse"||this.zc(function(){d=b.borderWidth+"|"+b.borderStyle+"|"+b.borderColor});return d}),zc:function(a){var b=this.d.runtimeStyle,d=b.borderWidth,e=b.borderColor;if(d)b.borderWidth="";if(e)b.borderColor="";a=a.call(this);if(d)b.borderWidth=d;if(e)b.borderColor=e;return a}});(function(){h.lb=h.p.ba({Aa:"border-radius",Ia:"borderRadius",ea:function(b){var d=null,e,c,g,i,j=false;if(b){c=new h.q(b);var f=function(){for(var k=[],l;(g=c.next())&&
g.G();){i=h.m(g.c);l=i.dc();if(l<0)return null;if(l>0)j=true;k.push(i)}return k.length>0&&k.length<5?{tl:k[0],tr:k[1]||k[0],br:k[2]||k[0],bl:k[3]||k[1]||k[0]}:null};if(b=f()){if(g){if(g.h&h.q.ya.xa&&g.c==="/")e=f()}else e=b;if(j&&b&&e)d={x:b,y:e}}}return d}});var a=h.m("0");a={tl:a,tr:a,br:a,bl:a};h.lb.Bc={x:a,y:a}})();h.Ib=h.p.ba({Aa:"border-image",Ia:"borderImage",hb:{stretch:1,round:1,repeat:1,space:1},ea:function(a){var b=null,d,e,c,g,i,j,f=0,k=h.q.ya,l=k.W,m=k.wa,o=k.Ta;if(a){d=new h.q(a);b=
{};for(var s=function(n){return n&&n.h&k.xa&&n.c==="/"},q=function(n){return n&&n.h&l&&n.c==="fill"},t=function(){g=d.va(function(n){return!(n.h&(m|o))});if(q(d.next())&&!b.fill)b.fill=true;else d.C();if(s(d.next())){f++;i=d.va(function(n){return!n.G()&&!(n.h&l&&n.c==="auto")});if(s(d.next())){f++;j=d.va(function(n){return!n.Ea()})}}else d.C()};a=d.next();){e=a.h;c=a.c;if(e&(m|o)&&!g){d.C();t()}else if(q(a)&&!b.fill){b.fill=true;t()}else if(e&l&&this.hb[c]&&!b.repeat){b.repeat={e:c};if(a=d.next())if(a.h&
l&&this.hb[a.c])b.repeat.wc=a.c;else d.C()}else if(e&k.URL&&!b.src)b.src=c;else return null}if(!b.src||!g||g.length<1||g.length>4||i&&i.length>4||f===1&&i.length<1||j&&j.length>4||f===2&&j.length<1)return null;if(!b.repeat)b.repeat={e:"stretch"};if(!b.repeat.wc)b.repeat.wc=b.repeat.e;a=function(n,u){return{t:u(n[0]),r:u(n[1]||n[0]),b:u(n[2]||n[0]),l:u(n[3]||n[1]||n[0])}};b.slice=a(g,function(n){return h.m(n.h&m?n.c+"px":n.c)});if(i&&i[0])b.O=a(i,function(n){return n.G()?h.m(n.c):n.c});if(j&&j[0])b.Ga=
a(j,function(n){return n.Ea()?h.m(n.c):n.c})}return b}});h.Hc=h.p.ba({Aa:"box-shadow",Ia:"boxShadow",ea:function(a){var b,d=h.m,e=h.q.ya,c;if(a){c=new h.q(a);b={Ga:[],Db:[]};for(a=function(){for(var g,i,j,f,k,l;g=c.next();){j=g.c;i=g.h;if(i&e.xa&&j===",")break;else if(g.Ea()&&!k){c.C();k=c.va(function(m){return!m.Ea()})}else if(i&e.u&&!f)f=j;else if(i&e.W&&j==="inset"&&!l)l=true;else return false}g=k&&k.length;if(g>1&&g<5){(l?b.Db:b.Ga).push({ke:d(k[0].c),le:d(k[1].c),blur:d(k[2]?k[2].c:"0"),$d:d(k[3]?
k[3].c:"0"),color:h.aa(f||"currentColor")});return true}return false};a(););}return b&&(b.Db.length||b.Ga.length)?b:null}});h.Nb=h.p.ba({ea:function(a){a=new h.q(a);for(var b=[],d;(d=a.next())&&d.G();)b.push(h.m(d.c));return b.length>0&&b.length<5?{t:b[0],r:b[1]||b[0],b:b[2]||b[0],l:b[3]||b[1]||b[0]}:null},T:h.p.oa(function(){var a=this.d,b=a.runtimeStyle,d=b.padding;if(d)b.padding="";a=a.currentStyle.padding;if(d)b.padding=d;return a})});h.Oc=h.p.ba({T:h.p.oa(function(){var a=this.d,b=a.runtimeStyle,
d=a.currentStyle;a=b.visibility;b.visibility="";d=d.visibility+"|"+d.display;b.visibility=a;return d}),ea:function(){var a=this.T().split("|");return{xc:a[0]!=="hidden",Vb:a[1]!=="none"}},j:function(){return false}});h.Pc=function(){function a(c){return function(){var g=arguments,i,j=g.length,f,k,l;f=this[d+c]||(this[d+c]={});for(i=0;i<j;i+=2)f[g[i]]=g[i+1];if(f=this.B()){if(c)f=f[c];for(i=0;i<j;i+=2){k=g[i];if(l=e[k])l.call(this,f,k,g[i+1]);else f[k]=g[i+1]}}}}function b(c,g){this.Xb="_pie_"+(c||
"shape")+h.Q.pa(this);this.eb=g||0}var d="_attrs_",e={colors:function(c,g,i){if(c[g])c[g].value=i;else c[g]=i},size:function(c,g,i){if(i){c[g].x=1;c[g]=i}else delete c[g]},"o:opacity2":function(c,g,i){if(i!==this.Id){this.B().insertAdjacentHTML("afterEnd",this.zb());this.k();this.Id=i}}};(function c(){try{H.namespaces.add("pievml","urn:schemas-microsoft-com:vml","#default#VML")}catch(g){setTimeout(c,1)}})();b.prototype={Sb:"behavior:url(#default#VML);",hd:"position:absolute;top:0px;left:0px;",gd:'coordorigin="1,1" stroked="false" ',
tagName:"shape",kc:0,B:function(){return this.kc?this.Qb||(this.Qb=H.getElementById(this.Xb)):null},fa:a(""),Ha:a("style"),w:a("fill"),ta:function(c,g){this.Ha("width",c+"px","height",g+"px");this.fa("coordsize",c*2+","+g*2)},Ad:function(){var c=this[d+"style"]||{},g=[],i;for(i in c)c.hasOwnProperty(i)&&g.push(i+":"+c[i]);return this.Sb+this.hd+g.join(";")},zb:function(){function c(m){if(m)for(var o in m)m.hasOwnProperty(o)&&i.push(" "+o+'="'+m[o]+'"')}function g(m){var o=j[d+m];if(o){i.push(k+m);
c(o);i.push(l)}}var i,j=this,f=j.tagName,k="<pievml:",l=' style="'+j.Sb+'" />';j.kc=1;i=[k,f,' id="',j.Xb,'" style="',j.Ad(),'" ',j.gd];c(j[d]);i.push(">");g("fill");i.push("</pievml:"+f+">");return i.join("")},k:function(){var c=this.B(),g=c&&c.parentNode;if(g){g.removeChild(c);delete this.Qb}}};return b}();h.v={sa:function(a){function b(d,e,c,g){this.d=d;this.o=e;this.g=c;this.parent=g}h.Fa(b.prototype,h.v,a);return b},ra:function(){return false},qc:h.pd,Gb:function(){this.j()?this.Ca():this.k()},
Bb:function(){this.d.runtimeStyle.borderColor="transparent"},k:function(){}};h.Fa(h.v,{B:function(a,b){var d=this.wb||(this.wb={}),e=d[a];if(!e){e=d[a]=new h.Pc(a,b);this.parent.sd(e)}return e},Ba:function(a){var b=this.wb,d=b&&b[a];if(d){d.k();this.parent.Sd(d);delete b[a]}return!!d},zd:function(a){var b=this.d,d=this.o.n(),e=d.f,c=d.e,g,i,j,f,k,l;d=a.x.tl.a(b,e);g=a.y.tl.a(b,c);i=a.x.tr.a(b,e);j=a.y.tr.a(b,c);f=a.x.br.a(b,e);k=a.y.br.a(b,c);l=a.x.bl.a(b,e);a=a.y.bl.a(b,c);e=Math.min(e/(d+i),c/(j+
k),e/(l+f),c/(g+a));if(e<1){d*=e;g*=e;i*=e;j*=e;f*=e;k*=e;l*=e;a*=e}return{x:{tl:d,tr:i,br:f,bl:l},y:{tl:g,tr:j,br:k,bl:a}}},Z:function(a,b,d,e,c,g){a=this.$(a,b,d,e,c,g);return"m"+a[0]+","+a[1]+"qy"+a[2]+","+a[3]+"l"+a[4]+","+a[5]+"qx"+a[6]+","+a[7]+"l"+a[8]+","+a[9]+"qy"+a[10]+","+a[11]+"l"+a[12]+","+a[13]+"qx"+a[14]+","+a[15]+"x"},$:function(a,b,d,e,c,g){var i=this.o.n(),j=i.f*c,f=i.e*c,k=Math;i=k.floor;var l=k.ceil,m=k.max;k=k.min;a*=c;b*=c;d*=c;e*=c;g||(g=this.g.F.i());if(g){g=this.zd(g);var o=
g.x.tl*c,s=g.y.tl*c,q=g.x.tr*c,t=g.y.tr*c,n=g.x.br*c,u=g.y.br*c,p=g.x.bl*c;c=g.y.bl*c;e=[i(e),i(k(m(s,a),f-d)),i(k(m(o,e),j-b)),i(a),l(m(e,j-m(q,b))),i(a),l(j-b),i(k(m(t,a),f-d)),l(j-b),l(m(a,f-m(u,d))),l(m(e,j-m(n,b))),l(f-d),i(k(m(p,e),j-b)),l(f-d),i(e),l(m(a,f-m(c,d)))]}else{a=i(a);b=l(j-b);d=l(f-d);e=i(e);e=[e,a,e,a,b,a,b,a,b,d,b,d,e,d,e,d]}return e},Bb:function(){var a=this.d,b=a.currentStyle,d=a.runtimeStyle,e=a.tagName,c=h.U===6,g;if(c&&(e in h.Tb||e==="FIELDSET")||e==="BUTTON"||e==="INPUT"&&
a.type in h.Hd){d.borderWidth="";e=this.g.s.sc;for(g=e.length;g--;){c=e[g];d["padding"+c]="";d["padding"+c]=h.m(b["padding"+c]).a(a)+h.m(b["border"+c+"Width"]).a(a)+(h.U!==8&&g%2?1:0)}d.borderWidth=0}else if(c){if(a.childNodes.length!==1||a.firstChild.tagName!=="ie6-mask"){b=H.createElement("ie6-mask");e=b.style;e.visibility="visible";for(e.zoom=1;e=a.firstChild;)b.appendChild(e);a.appendChild(b);d.visibility="hidden"}}else d.borderColor="transparent"},pe:function(){},k:function(){var a=this.wb,b;
if(a)for(b in a)a.hasOwnProperty(b)&&this.Ba(b)}});h.Mc=h.v.sa({j:function(){var a=this.ad;for(var b in a)if(a.hasOwnProperty(b)&&a[b].j())return true;return false},ac:function(){var a=this.ec(),b=a,d;a=a.currentStyle;var e=a.position,c=0,g=0;g=this.o.n();var i=this.g.jb.i(),j=g.jc;if(e==="fixed"&&h.U>6){c=g.x*j;g=g.y*j;b=e}else{do b=b.offsetParent;while(b&&b.currentStyle.position==="static");if(b){d=b.getBoundingClientRect();b=b.currentStyle;c=(g.x-d.left)*j-(parseFloat(b.borderLeftWidth)||0);g=
(g.y-d.top)*j-(parseFloat(b.borderTopWidth)||0)}else{b=H.documentElement;c=(g.x+b.scrollLeft-b.clientLeft)*j;g=(g.y+b.scrollTop-b.clientTop)*j}b="absolute"}return"direction:ltr;position:absolute;behavior:none !important;position:"+b+";left:"+c+"px;top:"+g+"px;z-index:"+(e==="static"?-1:a.zIndex)+";display:"+(i.xc&&i.Vb?"block":"none")},vc:function(){var a=this.bc();if(a&&(this.o.oc()||this.g.jb.L()))a.style.cssText=this.ac()},ec:function(){var a=this.d;return a.tagName in h.uc?a.offsetParent:a},bc:function(){var a=
this.sb;if(!a)a=this.sb=H.getElementById("_pie"+h.Q.pa(this));return a},Gb:function(){var a=this.Wa,b,d,e,c,g,i;if(this.j())if(a)if(b=this.vb){d=0;for(e=a.length;d<e;d++){for(c=b.length;c--;)if(b[c].eb<a[d].eb)break;if(c<0){g=this.bc();i="afterBegin"}else{g=b[c].B();i="afterEnd"}g.insertAdjacentHTML(i,a[d].zb());b.splice(c<0?0:c,0,a[d])}this.Wa=0;this.vc()}else{d=this.g.jb.i();if(d.xc&&d.Vb){a.sort(this.Wd);b=['<css3pie id="_pie'+h.Q.pa(this)+'" style="'+this.ac()+'">'];d=0;for(e=a.length;d<e;d++)b.push(a[d].zb());
b.push("</css3pie>");this.ec().insertAdjacentHTML("beforeBegin",b.join(""));this.vb=a;this.Wa=0}}else this.vc();else this.k()},Wd:function(a,b){return a.eb-b.eb},sd:function(a){(this.Wa||(this.Wa=[])).push(a)},Sd:function(a){var b=this.vb,d;if(b)for(d=b.length;d--;)if(b[d]===a){b.splice(d,1);break}},k:function(){var a=this.sb,b;if(a&&(b=a.parentNode))b.removeChild(a);delete this.sb;delete this.vb}});H.createElement("css3pie");h.Dc=h.v.sa({H:2,ra:function(){var a=this.g;return a.K.L()||a.F.L()},j:function(){var a=
this.g;return a.D.j()||a.F.j()||a.K.j()||a.na.j()&&a.na.i().Db},Ca:function(){var a=this.o.n();if(a.f&&a.e){this.nd();this.od()}},nd:function(){var a=this.g.K.i(),b=this.o.n(),d=this.d,e=a&&a.color,c;if(e&&e.Y()>0){this.fc();c=this.B("bgColor",this.H);c.ta(b.f,b.e);c.fa("path",this.$b(b,a.bd));c.w("color",e.M(d));a=e.Y();a<1&&c.w("opacity",a)}else this.Ba("bgColor")},od:function(){var a=this.g.K.i(),b=this.o.n();a=a&&a.R;var d,e,c,g,i;if(a){this.fc();c=b.f;g=b.e;for(i=a.length;i--;){d=a[i];e=this.B("bgImage"+
i,this.H+(0.5-i/1E3));e.fa("path",this.$b(b,d.Xa));e.ta(c,g);if(d.V==="linear-gradient")this.Xc(e,d);else{e.w("type","tile","color","none");this.Pd(e,d.Cb,i)}}}for(i=a?a.length:0;this.Ba("bgImage"+i++););},Pd:function(a,b,d){h.Q.Ac(b,function(e){var c=this.d,g=this.o.n(),i=g.f,j=g.e;if(i&&j){var f=this.g,k=f.K,l=k.i().R[d],m=k.ud(l.Ya,this.o,f.s,f.da);f=(l.Za||h.Ma.Jc).a(this.d,m.f,m.e,e.f,e.e);k=this.vd(l.Ya);c=l.ma?l.ma.coords(c,m.f-f.f,m.e-f.e):{x:0,y:0};l=l.bb;var o=0,s=0,q=i+1,t=j+1,n=h.U===
8?0:1;m=Math.round(k.x+c.x)+0.5;k=Math.round(k.y+c.y)+0.5;a.w("src",b,"position",m/i+","+k/j,"size",f.f!==e.f||f.e!==e.e||g.jc!==1||screen.logicalXDPI/screen.deviceXDPI!==1?h.Qa.gb(f.f)+"pt,"+h.Qa.gb(f.e)+"pt":"");if(l&&l!=="repeat"){if(l==="repeat-x"||l==="no-repeat"){o=k+1;t=k+f.e+n}if(l==="repeat-y"||l==="no-repeat"){s=m+1;q=m+f.f+n}a.Ha("clip","rect("+o+"px,"+q+"px,"+t+"px,"+s+"px)")}}},this)},$b:function(a,b){var d=0,e=0,c=0,g=0,i=this.d,j=this.g,f;if(b&&b!=="border-box")if((f=j.s.i())&&(f=f.O)){d+=
f.t.a(i);e+=f.r.a(i);c+=f.b.a(i);g+=f.l.a(i)}if(b==="content-box")if(b=j.da.i()){d+=b.t.a(i);e+=b.r.a(i);c+=b.b.a(i);g+=b.l.a(i)}return"m0,0r0,0m"+a.f*2+","+a.e*2+"r0,0"+this.Z(d,e,c,g,2)},vd:function(a){var b=this.d,d=this.g,e=0,c=0,g;if(a!=="border-box")if((g=d.s.i())&&(g=g.O)){e+=g.l.a(b);c+=g.t.a(b)}if(a==="content-box")if(a=d.da.i()){e+=a.l.a(b);c+=a.t.a(b)}return{x:e,y:c}},Xc:function(a,b){var d=this.d,e=this.o.n(),c=e.f,g=e.e;e=b.ua;var i=e.length,j=Math.PI,f=h.nb.xd(d,c,g,b),k=f.la;b=f.Jd;
var l,m;for(c=k%90?Math.atan2(f.be-f.rd,(f.qd-f.ae)*c/g)/j*180-90:-k;c<0;)c+=360;c%=360;g=[];j=[];for(f=0;f<i;f++)j.push(e[f].lc?e[f].lc.a(d,b):f===0?0:f===i-1?b:null);for(f=1;f<i;f++){if(j[f]===null){l=j[f-1];k=f;do m=j[++k];while(m===null);j[f]=l+(m-l)/(k-f+1)}j[f]=Math.max(j[f],j[f-1])}for(f=0;f<i;f++)g.push(j[f]/b*100+"% "+e[f].color.M(d));a.w("angle",c,"type","gradient","method","sigma","color",e[0].color.M(d),"color2",e[i-1].color.M(d),"colors",g.join(","));i===2&&a.w("opacity",e[1].color.Y(),
"o:opacity2",e[0].color.Y())},fc:function(){var a=this.d.runtimeStyle;a.backgroundImage="url(about:blank)";a.backgroundColor="transparent"},k:function(){h.v.k.call(this);var a=this.d.runtimeStyle;a.backgroundImage=a.backgroundColor=""}});h.Fc=h.v.sa({H:4,Xd:{t:[2,1,0,3,4,7,6,5,90],r:[4,7,6,5,10,9,8,11,0],b:[10,9,8,11,12,15,14,13,270],l:[12,15,14,13,2,1,0,3,180]},fd:{dotted:1,dashed:1},Ub:{groove:1,ridge:1,inset:1,outset:1},md:{groove:1,ridge:1,"double":1},ra:function(){var a=this.g;return a.s.L()||
a.F.L()},j:function(){var a=this.g;return a.F.j()&&!a.D.j()&&a.s.j()},Ca:function(){var a=this.g.s.i(),b=this.o.n(),d,e,c,g;if(a){this.Bb();d=this.wd();e=c=0;for(g=d.length;e<g;e+=2){a=this.B("border"+c++,this.H);a.ta(b.f,b.e);a.fa("path",d[e]);a.w("color",d[e+1])}for(;this.Ba("border"+c++););}},S:function(a,b,d,e,c,g,i){i=e*(i==="dashed"?3:1);e=c+e;var j;if(i<d-b)for(b+=(d-b-i)/2%i;b<d;){j=Math.min(b+i,d);a.push(g?"m"+c+","+b+"l"+c+","+j+"l"+e+","+j+"l"+e+","+b+"x":"m"+b+","+c+"l"+j+","+c+"l"+j+
","+e+"l"+b+","+e+"x");b+=i*2}},wd:function(){var a=this.g.s,b=[];if(a.j()){var d=this.d,e=this.o.n(),c=a.i(),g=c.O;a=c.de;var i=c.dd,j=Math,f=j.abs,k=j.round;j=k(g.t.a(d));var l=k(g.r.a(d)),m=k(g.b.a(d));g=k(g.l.a(d));k=[];var o,s,q,t=this.Xd,n,u=this.fd,p,r;if(c.ee&&c.ed&&!(a.t in this.Ub)){if(i.t.Y()>0){k[0]=this.Z(0,0,0,0,2);p=a.t;if(p==="double")k.push(this.Z(j/3,l/3,m/3,g/3,2)+this.Z(j*2/3,l*2/3,m*2/3,g*2/3,2));else if(p in u){c=this.$(j,l,m,g,2);this.S(k,c[2],c[4],j*2,0,0,a.t);this.S(k,c[7],
c[9],l*2,(e.f-l)*2,1,a.r);this.S(k,c[12],c[10],m*2,(e.e-m)*2,0,a.b);this.S(k,c[1],c[15],g*2,0,1,a.l)}k.push(this.Z(j,l,m,g,2));b.push(k.join(""),i.t.M(d))}}else{o=this.$(0,0,0,0,2);c=this.$(j,l,m,g,2);for(n in t)if(t.hasOwnProperty(n)&&i[n].Y()>0){p=t[n];var v=p[0],C=p[1],y=p[2],B=p[3],F=p[4],G=p[5],K=p[6],J=p[7],w=p[8],P=n==="t"||n==="l";p=a[n];k[0]="al"+o[v]+","+o[C]+","+f(o[y]-o[v])+","+f(o[B]-o[C])+","+(w+45)*65535+",-2949075ae"+o[F]+","+o[G]+","+f(o[K]-o[F])+","+f(o[J]-o[G])+","+w*65535+",-2949075";
if(p in this.md){if(!s)if(p==="double"){s=this.$(j/3,l/3,m/3,g/3,2);q=this.$(j*2/3,l*2/3,m*2/3,g*2/3,2)}else s=q=this.$(j/2,l/2,m/2,g/2,2);k.push("ae"+s[F]+","+s[G]+","+f(s[K]-s[F])+","+f(s[J]-s[G])+","+(w-45)*65535+",2949075ae"+s[v]+","+s[C]+","+f(s[y]-s[v])+","+f(s[B]-s[C])+","+w*65535+",2949075x");if(p!=="double"){r=i[n].M(d)+((p==="groove"?P:!P)?" darken(128)":" lighten(128)");b.push(k.join(""),r);k.length=0}k.push("al"+q[v]+","+q[C]+","+f(q[y]-q[v])+","+f(q[B]-q[C])+","+(w+45)*65535+",-2949075ae"+
q[F]+","+q[G]+","+f(q[K]-q[F])+","+f(q[J]-q[G])+","+w*65535+",-2949075")}k.push("ae"+c[F]+","+c[G]+","+f(c[K]-c[F])+","+f(c[J]-c[G])+","+(w-45)*65535+",2949075ae"+c[v]+","+c[C]+","+f(c[y]-c[v])+","+f(c[B]-c[C])+","+w*65535+",2949075x");if(p in u)n==="t"?this.S(k,c[2],c[4],j*2,0,0,p):n==="r"?this.S(k,c[7],c[9],l*2,(e.f-l)*2,1,p):n==="b"?this.S(k,c[12],c[10],m*2,(e.e-m)*2,0,p):this.S(k,c[1],c[15],g*2,0,1,p);r=i[n].M(d);if(p in this.Ub)r+=(p==="groove"||p==="outset"?P:!P)?" lighten(128)":" darken(128)";
b.push(k.join(""),r);k.length=0}}}return b},k:function(){if(this.Yb||!this.g.D.j())this.d.runtimeStyle.borderColor="";h.v.k.call(this)}});h.Ec=h.v.sa({H:5,ra:function(){return this.g.D.L()},j:function(){return this.g.D.j()},Ca:function(){var a=this.g.D.i(),b=this.g.s.i(),d=this.o.n(),e=this.d;h.Q.Ac(a.src,function(c){function g(r,v,C,y,B,F,G,K,J){var w=Math.max;if(!u||!p||!y||!B||!K||!J)r.Ha("display","none");else{y=w(y,0);B=w(B,0);r.fa("path","m0,0l"+y*2+",0l"+y*2+","+B*2+"l0,"+B*2+"x");r.w("src",
n,"type","tile","position","0,0","origin",(F-0.5)/u+","+(G-0.5)/p,"size",h.Qa.gb(y*u/K)+"pt,"+h.Qa.gb(B*p/J)+"pt");r.ta(y,B);r.Ha("left",v+"px","top",C+"px","display","")}}var i=d.f,j=d.e,f=h.m("0"),k=a.O||(b?b.O:{t:f,r:f,b:f,l:f});f=k.t.a(e);var l=k.r.a(e),m=k.b.a(e);k=k.l.a(e);var o=a.slice,s=o.t.a(e),q=o.r.a(e),t=o.b.a(e);o=o.l.a(e);var n=a.src,u=c.f,p=c.e;g(this.N("tl"),0,0,k,f,0,0,o,s);g(this.N("t"),k,0,i-k-l,f,o,0,u-o-q,s);g(this.N("tr"),i-l,0,l,f,u-q,0,q,s);g(this.N("r"),i-l,f,l,j-f-m,u-q,
s,q,p-s-t);g(this.N("br"),i-l,j-m,l,m,u-q,p-t,q,t);g(this.N("b"),k,j-m,i-k-l,m,o,p-t,u-o-q,t);g(this.N("bl"),0,j-m,k,m,0,p-t,o,t);g(this.N("l"),0,f,k,j-f-m,0,s,o,p-s-t);g(this.N("c"),k,f,i-k-l,j-f-m,o,s,a.fill?u-o-q:0,p-s-t)},this)},N:function(a){return this.B("borderImage_"+a,this.H)},qc:function(){if(this.j()){var a=this.d,b=a.runtimeStyle,d=this.g.D.i().O;b.borderStyle="solid";if(d){b.borderTopWidth=d.t.a(a);b.borderRightWidth=d.r.a(a);b.borderBottomWidth=d.b.a(a);b.borderLeftWidth=d.l.a(a)}this.Bb()}},
k:function(){var a=this.d.runtimeStyle;a.borderStyle="";if(this.Yb||!this.g.s.j())a.borderColor=a.borderWidth="";h.v.k.call(this)}});h.Gc=h.v.sa({H:1,ra:function(){var a=this.g;return a.na.L()||a.F.L()},j:function(){var a=this.g.na;return a.j()&&a.i().Ga[0]},Ca:function(){var a=this.d,b=this.g,d=b.na.i().Ga;b=b.F.i();var e=d.length,c=e,g=this.o.n(),i=g.f;g=g.e;for(var j,f,k,l,m,o,s,q,t,n;c--;){j=d[c];k=j.ke.a(a);l=j.le.a(a);m=j.$d.a(a);o=j.blur.a(a);j=j.color;s=j.Y();j=j.M(a);f=-m-o;if(!b&&o)b=h.lb.Bc;
q=this.Z(f,f,f,f,2,b);f=this.B("shadow"+c,this.H+(0.5-c/1E3));if(o){t=(m+o)*2+i;n=(m+o)*2+g;m=t?o*2/t:0;o=n?o*2/n:0;if(m>0.5||o>0.5){t=0.5/Math.max(m,o);m*=t;o*=t;s*=t*t}f.w("type","gradienttitle","color2",j,"focusposition",m+","+o,"focussize",1-m*2+","+(1-o*2),"opacity",0,"o:opacity2",s)}else f.w("type","solid","opacity",s);f.fa("path",q);f.w("color",j);f.Ha("left",k+"px","top",l+"px");f.ta(i,g)}for(;this.Ba("shadow"+e++););}});h.Lc=h.v.sa({H:6,ra:function(){var a=this.g;return this.d.src!==this.Sc||
a.F.L()},j:function(){var a=this.g;return a.F.j()||a.K.ic()},Ca:function(){this.Sc=g;this.Ed();var a=this.B("img",this.H),b=this.o.n(),d=b.f;b=b.e;var e=this.g.s.i(),c=e&&e.O;e=this.d;var g=e.src,i=Math.round,j=this.g.da.i();if(!c||h.U<7){c=h.m("0");c={t:c,r:c,b:c,l:c}}a.fa("path",this.Z(i(c.t.a(e)+j.t.a(e)),i(c.r.a(e)+j.r.a(e)),i(c.b.a(e)+j.b.a(e)),i(c.l.a(e)+j.l.a(e)),2));a.w("type","frame","src",g,"position",(d?0.5/d:0)+","+(b?0.5/b:0));a.ta(d,b)},Ed:function(){this.d.runtimeStyle.filter="alpha(opacity=0)"},
k:function(){h.v.k.call(this);this.d.runtimeStyle.filter=""}});h.mb=function(){function a(n,u){n.className+=" "+u}function b(n){var u=t.slice.call(arguments,1),p=u.length;setTimeout(function(){if(n)for(;p--;)a(n,u[p])},0)}function d(n){var u=t.slice.call(arguments,1),p=u.length;setTimeout(function(){if(n)for(;p--;){var r=u[p];r=q[r]||(q[r]=new RegExp("\\b"+r+"\\b","g"));n.className=n.className.replace(r,"")}},0)}function e(n){function u(){if(!T){var x,z,E=h.qa,N=n.currentStyle,I=N.getAttribute(g)===
"true",Z=N.getAttribute(j)!=="false",$=N.getAttribute(f)!=="false";R=N.getAttribute(i);R=E>7?R!=="false":R==="true";if(!U){U=1;n.runtimeStyle.zoom=1;N=n;for(var aa=1;N=N.previousSibling;)if(N.nodeType===1){aa=0;break}aa&&a(n,o)}D.cb();if(I&&(z=D.n())&&(x=H.documentElement||H.body)&&(z.y>x.clientHeight||z.x>x.clientWidth||z.y+z.e<0||z.x+z.f<0)){if(!X){X=1;h.pb.ca(u)}}else{T=1;X=U=0;h.pb.Ka(u);if(E===9){A={K:new h.Hb(n),D:new h.Ib(n),s:new h.Jb(n),da:new h.Nb(n)};Q=[A.K,A.s,A.D,A.da];L=new h.oe(n,D,
A);M=[new h.me(n,D,A,L),new h.ne(n,D,A,L)]}else{A={K:new h.Hb(n),s:new h.Jb(n),D:new h.Ib(n),F:new h.lb(n),na:new h.Hc(n),da:new h.Nb(n),jb:new h.Oc(n)};Q=[A.K,A.s,A.D,A.F,A.na,A.da,A.jb];L=new h.Mc(n,D,A);M=[new h.Gc(n,D,A,L),new h.Dc(n,D,A,L),new h.Fc(n,D,A,L),new h.Ec(n,D,A,L)];n.tagName==="IMG"&&M.push(new h.Lc(n,D,A,L));L.ad=M}if(x=n.currentStyle.getAttribute(h.z+"watch-ancestors")){x=parseInt(x,10);z=0;for(I=n.parentNode;I&&(x==="NaN"||z++<x);){w(I,"onpropertychange",J);w(I,"onmouseenter",C);
w(I,"onmouseleave",y);w(I,"onmousedown",B);if(I.tagName in h.Zb){w(I,"onfocus",G);w(I,"onblur",K)}I=I.parentNode}}if(R){h.Pa.ca(r);h.Pa.Ud()}r(0,1)}if(!V){V=1;E<9&&w(n,"onmove",p);w(n,"onresize",p);w(n,"onpropertychange",v);$&&w(n,"onmouseenter",C);if($||Z)w(n,"onmouseleave",y);Z&&w(n,"onmousedown",B);if(n.tagName in h.Zb){w(n,"onfocus",G);w(n,"onblur",K)}h.Sa.ca(p);h.J.ca(P)}D.ib()}}function p(){D&&D.Cd()&&r()}function r(x,z){if(!Y)if(T){D.cb();for(var E=Q.length;E--;)Q[E].cb();E=0;for(var N=M.length,
I=D.Yd();E<N;E++)M[E].qc();for(E=0;E<N;E++)if(z||I||x&&M[E].ra())M[E].Gb();if(z||I||x||D.oc())L.Gb();for(x=Q.length;x--;)Q[x].ib();D.ib()}else U||u()}function v(){T&&!(event&&event.propertyName in s)&&r(1)}function C(){b(n,k)}function y(){d(n,k,l)}function B(){b(n,l);h.ob.ca(F)}function F(){d(n,l);h.ob.Ka(F)}function G(){b(n,m)}function K(){d(n,m)}function J(){var x=event.propertyName;if(x==="className"||x==="id"||x.indexOf("style.")===0)v()}function w(x,z,E){x.attachEvent(z,E);W.push([x,z,E])}function P(){if(V){for(var x=
W.length,z;x--;){z=W[x];z[0].detachEvent(z[1],z[2])}h.J.Ka(P);V=0;W=[]}}function ba(){if(!Y){var x,z;P();Y=1;if(M){x=0;for(z=M.length;x<z;x++){M[x].Yb=1;M[x].k()}}L.k();R&&h.Pa.Ka(r);h.Sa.Ka(r);M=L=D=A=Q=n=null;S.Wb=S=0}}var S=this,M,L,D=new h.Kb(n),A,Q,U,T,V,W=[],X,Y,R;S.Wb=n;S.Gd=u;S.k=ba}var c={},g=h.z+"lazy-init",i=h.z+"poll",j=h.z+"track-active",f=h.z+"track-hover",k=h.Na+"hover",l=h.Na+"active",m=h.Na+"focus",o=h.Na+"first-child",s={background:1,bgColor:1,display:1},q={},t=[];e.yd=function(n){var u=
n.uniqueID;return c[u]||(c[u]=new e(n))};e.k=function(n){n=n.uniqueID;var u=c[n];if(u){u.k();delete c[n]}};e.kd=function(){var n=[],u;if(c){for(var p in c)if(c.hasOwnProperty(p)){u=c[p];n.push(u.Wb);u.k()}c={}}return n};return e}();h.version="2.0beta1";h.supportsVML=h.tc;h.attach=function(a){if(h.qa===9||h.qa<9&&h.tc)h.mb.yd(a).Gd()};h.detach=function(a){h.mb.k(a)}})(window,document);

}).call(this,require("p8eFRy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/javascript-magic/js/plugins/PIE_IE678.js","/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/javascript-magic/js/plugins")
},{"buffer":3,"p8eFRy":7}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("p8eFRy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/process/browser.js","/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/process")
},{"buffer":3,"p8eFRy":7}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*! Respond.js v1.4.2: min/max-width media query polyfill
 * Copyright 2014 Scott Jehl
 * Licensed under MIT
 * http://j.mp/respondjs */

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
(function(w) {
  "use strict";
  w.matchMedia = w.matchMedia || function(doc, undefined) {
    var bool, docElem = doc.documentElement, refNode = docElem.firstElementChild || docElem.firstChild, fakeBody = doc.createElement("body"), div = doc.createElement("div");
    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);
    return function(q) {
      div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';
      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);
      return {
        matches: bool,
        media: q
      };
    };
  }(w.document);
})(this);

(function(w) {
  "use strict";
  var respond = {};
  w.respond = respond;
  respond.update = function() {};
  var requestQueue = [], xmlHttp = function() {
    var xmlhttpmethod = false;
    try {
      xmlhttpmethod = new w.XMLHttpRequest();
    } catch (e) {
      xmlhttpmethod = new w.ActiveXObject("Microsoft.XMLHTTP");
    }
    return function() {
      return xmlhttpmethod;
    };
  }(), ajax = function(url, callback) {
    var req = xmlHttp();
    if (!req) {
      return;
    }
    req.open("GET", url, true);
    req.onreadystatechange = function() {
      if (req.readyState !== 4 || req.status !== 200 && req.status !== 304) {
        return;
      }
      callback(req.responseText);
    };
    if (req.readyState === 4) {
      return;
    }
    req.send(null);
  }, isUnsupportedMediaQuery = function(query) {
    return query.replace(respond.regex.minmaxwh, "").match(respond.regex.other);
  };
  respond.ajax = ajax;
  respond.queue = requestQueue;
  respond.unsupportedmq = isUnsupportedMediaQuery;
  respond.regex = {
    media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
    keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
    comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
    urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
    findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
    only: /(only\s+)?([a-zA-Z]+)\s?/,
    minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
    maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
    minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
    other: /\([^\)]*\)/g
  };
  respond.mediaQueriesSupported = w.matchMedia && w.matchMedia("only all") !== null && w.matchMedia("only all").matches;
  if (respond.mediaQueriesSupported) {
    return;
  }
  var doc = w.document, docElem = doc.documentElement, mediastyles = [], rules = [], appendedEls = [], parsedSheets = {}, resizeThrottle = 30, head = doc.getElementsByTagName("head")[0] || docElem, base = doc.getElementsByTagName("base")[0], links = head.getElementsByTagName("link"), lastCall, resizeDefer, eminpx, getEmValue = function() {
    var ret, div = doc.createElement("div"), body = doc.body, originalHTMLFontSize = docElem.style.fontSize, originalBodyFontSize = body && body.style.fontSize, fakeUsed = false;
    div.style.cssText = "position:absolute;font-size:1em;width:1em";
    if (!body) {
      body = fakeUsed = doc.createElement("body");
      body.style.background = "none";
    }
    docElem.style.fontSize = "100%";
    body.style.fontSize = "100%";
    body.appendChild(div);
    if (fakeUsed) {
      docElem.insertBefore(body, docElem.firstChild);
    }
    ret = div.offsetWidth;
    if (fakeUsed) {
      docElem.removeChild(body);
    } else {
      body.removeChild(div);
    }
    docElem.style.fontSize = originalHTMLFontSize;
    if (originalBodyFontSize) {
      body.style.fontSize = originalBodyFontSize;
    }
    ret = eminpx = parseFloat(ret);
    return ret;
  }, applyMedia = function(fromResize) {
    var name = "clientWidth", docElemProp = docElem[name], currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[name] || docElemProp, styleBlocks = {}, lastLink = links[links.length - 1], now = new Date().getTime();
    if (fromResize && lastCall && now - lastCall < resizeThrottle) {
      w.clearTimeout(resizeDefer);
      resizeDefer = w.setTimeout(applyMedia, resizeThrottle);
      return;
    } else {
      lastCall = now;
    }
    for (var i in mediastyles) {
      if (mediastyles.hasOwnProperty(i)) {
        var thisstyle = mediastyles[i], min = thisstyle.minw, max = thisstyle.maxw, minnull = min === null, maxnull = max === null, em = "em";
        if (!!min) {
          min = parseFloat(min) * (min.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
        }
        if (!!max) {
          max = parseFloat(max) * (max.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
        }
        if (!thisstyle.hasquery || (!minnull || !maxnull) && (minnull || currWidth >= min) && (maxnull || currWidth <= max)) {
          if (!styleBlocks[thisstyle.media]) {
            styleBlocks[thisstyle.media] = [];
          }
          styleBlocks[thisstyle.media].push(rules[thisstyle.rules]);
        }
      }
    }
    for (var j in appendedEls) {
      if (appendedEls.hasOwnProperty(j)) {
        if (appendedEls[j] && appendedEls[j].parentNode === head) {
          head.removeChild(appendedEls[j]);
        }
      }
    }
    appendedEls.length = 0;
    for (var k in styleBlocks) {
      if (styleBlocks.hasOwnProperty(k)) {
        var ss = doc.createElement("style"), css = styleBlocks[k].join("\n");
        ss.type = "text/css";
        ss.media = k;
        head.insertBefore(ss, lastLink.nextSibling);
        if (ss.styleSheet) {
          ss.styleSheet.cssText = css;
        } else {
          ss.appendChild(doc.createTextNode(css));
        }
        appendedEls.push(ss);
      }
    }
  }, translate = function(styles, href, media) {
    var qs = styles.replace(respond.regex.comments, "").replace(respond.regex.keyframes, "").match(respond.regex.media), ql = qs && qs.length || 0;
    href = href.substring(0, href.lastIndexOf("/"));
    var repUrls = function(css) {
      return css.replace(respond.regex.urls, "$1" + href + "$2$3");
    }, useMedia = !ql && media;
    if (href.length) {
      href += "/";
    }
    if (useMedia) {
      ql = 1;
    }
    for (var i = 0; i < ql; i++) {
      var fullq, thisq, eachq, eql;
      if (useMedia) {
        fullq = media;
        rules.push(repUrls(styles));
      } else {
        fullq = qs[i].match(respond.regex.findStyles) && RegExp.$1;
        rules.push(RegExp.$2 && repUrls(RegExp.$2));
      }
      eachq = fullq.split(",");
      eql = eachq.length;
      for (var j = 0; j < eql; j++) {
        thisq = eachq[j];
        if (isUnsupportedMediaQuery(thisq)) {
          continue;
        }
        mediastyles.push({
          media: thisq.split("(")[0].match(respond.regex.only) && RegExp.$2 || "all",
          rules: rules.length - 1,
          hasquery: thisq.indexOf("(") > -1,
          minw: thisq.match(respond.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
          maxw: thisq.match(respond.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
        });
      }
    }
    applyMedia();
  }, makeRequests = function() {
    if (requestQueue.length) {
      var thisRequest = requestQueue.shift();
      ajax(thisRequest.href, function(styles) {
        translate(styles, thisRequest.href, thisRequest.media);
        parsedSheets[thisRequest.href] = true;
        w.setTimeout(function() {
          makeRequests();
        }, 0);
      });
    }
  }, ripCSS = function() {
    for (var i = 0; i < links.length; i++) {
      var sheet = links[i], href = sheet.href, media = sheet.media, isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";
      if (!!href && isCSS && !parsedSheets[href]) {
        if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
          translate(sheet.styleSheet.rawCssText, href, media);
          parsedSheets[href] = true;
        } else {
          if (!/^([a-zA-Z:]*\/\/)/.test(href) && !base || href.replace(RegExp.$1, "").split("/")[0] === w.location.host) {
            if (href.substring(0, 2) === "//") {
              href = w.location.protocol + href;
            }
            requestQueue.push({
              href: href,
              media: media
            });
          }
        }
      }
    }
    makeRequests();
  };
  ripCSS();
  respond.update = ripCSS;
  respond.getEmValue = getEmValue;
  function callMedia() {
    applyMedia(true);
  }
  if (w.addEventListener) {
    w.addEventListener("resize", callMedia, false);
  } else if (w.attachEvent) {
    w.attachEvent("onresize", callMedia);
  }
})(this);
}).call(this,require("p8eFRy"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/respond.js/dest/respond.src.js","/../../../../../../../../../usr/local/lib/node_modules/frontend-magic/node_modules/respond.js/dest")
},{"buffer":3,"p8eFRy":7}]},{},[1])