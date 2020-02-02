'use strict';
const expect = require('chai').expect;
const testHelpers = require('../../lib/testHelpers');
const HalModuleParser = require('../../lib/HalModuleParser');

describe('testHelpers', function() {
	describe('createFirmwareBinary', function() {
		it('creates a valid user part', function() {
			const productId = 42;
			const productVersion = 3;
			const platformId = 6;
			const depModuleVersion = 1234;

			const binary = testHelpers.createFirmwareBinary({ productId, productVersion, platformId, depModuleVersion });

			const parser = new HalModuleParser();
			return parser.parseBuffer({ fileBuffer: binary }).then((fileInfo) => {
				expect(fileInfo).to.be.ok;
				expect(fileInfo.prefixInfo.platformID).to.eql(platformId);
				expect(fileInfo.prefixInfo.depModuleVersion).to.eql(depModuleVersion);
				expect(fileInfo.suffixInfo.productId).to.eql(productId);
				expect(fileInfo.suffixInfo.productVersion).to.eql(productVersion);
			});
		});
	});
});
