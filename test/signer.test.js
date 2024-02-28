
const crypto = require('crypto')
const assert = require("node:assert");
const { describe, it } = require('node:test');
const { Cookie } = require('../lib/cookie.js')
const { CookieSigner } = require("../lib/signer.js")


const BASE64_PATTERN = /=/g

describe('CookieSigner test', function() {

    describe('"secrets" option', function () {

        it('should set string secret', function () {
            const secret = 'asd'
            const theSigner = new CookieSigner(secret)
            assert.deepStrictEqual(theSigner.secrets, [secret])
        })

        it('should set array of string secrets', function () {
            const secret = ['secret']
            const theSigner = new CookieSigner(secret)
            assert.deepStrictEqual(theSigner.secrets, secret)
        })

        it('should set Buffer secret', function () {
            const secret = Buffer.from('deadbeef76543210', 'hex')
            const theSigner = new CookieSigner(secret)
            assert.deepStrictEqual(theSigner.secrets, [secret])
        })

        it('should set array of Buffer secrets', function () {
            const secret = [ Buffer.from('deadbeef76543210', 'hex') ]
            const theSigner = new CookieSigner(secret)
            assert.deepStrictEqual(theSigner.secrets, secret)
        })

        it('should set parameter string secret', function () {
            const secret = 'asd'
            const theSigner = new CookieSigner('a')
            theSigner.secrets = [secret]
            assert.deepStrictEqual(theSigner.secrets, [secret])
        })

        it('should set parameter Buffer secret', function () {
            const secret = [ Buffer.from('deadbeef76543210', 'hex') ]
            const theSigner = new CookieSigner(secret)
            assert.deepStrictEqual(theSigner.secrets, secret)
        })

        it('should throw when secrets is invalid', function () {
            assert.throws(
                () => new CookieSigner(1), 
                { message: `Signer secret must be an array containing strings or buffers.` }
            )
        })

    })

    describe('"algorithm" option', function () {

        it('should set parameter algorithm', function () {
            const algorithm = 'sha512'
            const theSigner = new CookieSigner('secret')
            theSigner.algorithm = algorithm
            assert.deepStrictEqual(theSigner.algorithm, algorithm)
        })

        it('should set constructor algorithm', function () {
            const algorithm = 'sha512'
            const theSigner = new CookieSigner('secret', algorithm)
            assert.deepStrictEqual(theSigner.algorithm, algorithm)
        })

        it('should use default algorithm', function () {
            const algorithm = 'sha256'
            const theSigner = new CookieSigner('secret')
            assert.deepStrictEqual(theSigner.algorithm, algorithm)
        })

        it('should throw when algorithm is invalid', function () {
            assert.throws(
                () => new CookieSigner('secret', 'invalid'), { message: `Signer algorithm "invalid" not supported.` }
            )
        })

    })

    describe('"sign" method', function () { 

        it('should sign Cookie value', function () {
            const secret = 'secret'
            const value = 'some-value'
            const expected = crypto.createHmac('sha256', secret).update(value).digest('base64').replace(BASE64_PATTERN, '')
            const theCookie = new Cookie('name', value)
            const theSigner = new CookieSigner(secret)
            const signedCookie = theSigner.sign(theCookie)
            assert.strictEqual(signedCookie.value, `${value}.${expected}`)
        })

        it('should sign Cookie value when have multiple secrets', function () {
            const secret = ['secret', 'secret-1']
            const value = 'some-value'
            const expected = crypto.createHmac('sha256', secret[0]).update(value).digest('base64').replace(BASE64_PATTERN, '')
            const theCookie = new Cookie('name', value)
            const theSigner = new CookieSigner(secret)
            const signedCookie = theSigner.sign(theCookie)
            assert.strictEqual(signedCookie.value, `${value}.${expected}`)
        })

        it('should throw when cookie is not instance of Cookie', function () {
            const theSigner = new CookieSigner('secret')
            assert.throws(
                () => theSigner.sign(1), { message: `Signer cookie should be instance of Cookie.` }
            )
        })

        it('should throw when cookie value is undefined', function () {
            const theSigner = new CookieSigner('secret')
            const theCookie = new Cookie('name')
            assert.throws(
                () => theSigner.sign(theCookie), { message: `Signer cookie "name" is undefined or empty string.` }
            )
        })

    })

    describe('"unsign" method', function () { 

        it('should unsign value', function () {
            const secret = 'secret'
            const expected = 'some-value'
            const value = crypto.createHmac('sha256', secret).update(expected).digest('base64').replace(BASE64_PATTERN, '')
            const theCookie = new Cookie('name', `${expected}.${value}`)
            const theSigner = new CookieSigner(secret)
            const theUnsignedCookie = theSigner.unsign(theCookie)
            assert.strictEqual(theUnsignedCookie.value, expected)
            assert.strictEqual(theUnsignedCookie.valid, true)
            assert.strictEqual(theUnsignedCookie.renew, false)
        })

        it('should unsign value signed by secondary secret', function () {
            const secret = ['secret-1', 'secret']
            const expected = 'some-value'
            const value = crypto.createHmac('sha256', secret[1]).update(expected).digest('base64').replace(BASE64_PATTERN, '')
            const theCookie = new Cookie('name', `${expected}.${value}`)
            const theSigner = new CookieSigner(secret)
            const theUnsignedCookie = theSigner.unsign(theCookie)
            assert.strictEqual(theUnsignedCookie.value, expected)
            assert.strictEqual(theUnsignedCookie.valid, true)
            assert.strictEqual(theUnsignedCookie.renew, true)
        })

        it('should not unsign value ', function () {
            const secret = 'secret'
            const expected = 'some-value'
            const value = crypto.createHmac('sha256', secret).update(expected).digest('base64').replace(BASE64_PATTERN, '')
            const theCookie = new Cookie('name', `${expected}.${value}`)
            const theSigner = new CookieSigner('secret-1')
            const theUnsignedCookie = theSigner.unsign(theCookie)
            assert.strictEqual(theUnsignedCookie.value, '')
            assert.strictEqual(theUnsignedCookie.valid, false)
            assert.strictEqual(theUnsignedCookie.renew, false)
        })

        it('should throw when cookie is not instance of Cookie', function () {
            const theSigner = new CookieSigner('secret')
            assert.throws(
                () => theSigner.unsign(1), { message: `Signer cookie should be instance of Cookie.` }
            )
        })

    })

})