'use strict';

const crc32 = require('buffer-crc32');
const { FunctionType } = require('./ModuleInfo');

module.exports = {
	// Creates a valid firmware binary for usage in tests
	createFirmwareBinary({ buffer = Buffer.from('dummy'), productId, productVersion, platformId, moduleFunction = FunctionType.USER_PART, moduleIndex = 1, depModuleFunction = FunctionType.SYSTEM_PART, depModuleIndex = 1, depModuleVersion = 1000 } = {}) {

		// Offsets correspond to HalModuleParser.js#L299
		const prefix = Buffer.alloc(0x19, 0);
		prefix.write('80000000', 0, 4, 'hex');
		prefix.writeUInt16LE(platformId, 12);
		prefix.writeUInt8(moduleFunction, 14);
		prefix.writeUInt8(moduleIndex, 15);
		prefix.writeUInt8(depModuleFunction, 16);
		prefix.writeUInt8(depModuleIndex, 17);
		prefix.writeUInt16LE(depModuleVersion, 18);
		const filler = Buffer.alloc(0x200, 0);

		if (typeof productId === 'undefined') {
			productId = 0xffffffff;
		}
		if (typeof productVersion === 'undefined') {
			productId = 0xffff;
		}
		const suffixLength = 42;
		const suffix = Buffer.alloc(suffixLength, 0);
		suffix.writeUInt16LE(productId / 65536, 0);
		suffix.writeUInt16LE(productId & 0xffff, 2);
		suffix.writeUInt16LE(productVersion, 4);
		suffix.writeUInt16LE(0, 6);
		suffix.writeUInt16LE(suffixLength, suffix.length - 2);

		const fwBuffer = Buffer.concat([prefix, filler, buffer, suffix]);
		const crc = crc32(fwBuffer);
		return Buffer.concat([fwBuffer, crc]);
	}
};
