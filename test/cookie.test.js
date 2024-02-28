'use strict'

const assert = require("node:assert");
const { describe, it } = require('node:test');
const { CookieParams, Cookie } = require("../lib/cookie.js")

describe('CookieParams test', function () {

    describe('"domain" option', function () {

        it('should set domain', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.domain = 'example.com'
            assert.strictEqual(theParams.domain, 'example.com')
        })

        it('should set domain from constructor', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { domain: 'example.com' })
            assert.strictEqual(theParams.domain, 'example.com')
        })

        it('should return undefined', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            assert.strictEqual(theParams.domain, undefined)
        })

        it('should throw for invalid value', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { domain: 'example.com\n' }), 
                { message: 'Cookie "foo" domain option is invalid.'}
            )
        })

    })

    describe('"expires" option', function () {

        it('should set expires', function () {
            const theCookie = { name: 'foo' }
            const expires = new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900))
            const theParams = new CookieParams(theCookie)
            theParams.expires = expires
            assert.deepStrictEqual(theParams.expires, expires)
        })

        it('should set expires from constructor ', function () {
            const theCookie = { name: 'foo' }
            const expires = new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900))
            const theParams = new CookieParams(theCookie, { expires })
            assert.deepStrictEqual(theParams.expires, expires)
        })

        it('should return undefined', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            assert.strictEqual(theParams.expires, undefined)
        })

        it('should throw when expires is non-Date', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { expires: 42 }), 
                { message: 'Cookie "foo" expires option is invalid.' }
            )
        })

        it('should throw when expires is invalid date', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { expires: NaN }), 
                { message: 'Cookie "foo" expires option is invalid.' }
            )
        })

    })

    describe('"httpOnly" option', function () {

        it('should set httpOnly', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.httpOnly = true
            assert.deepStrictEqual(theParams.httpOnly, true)
        })

        it('should not set httpOnly if value is false', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { httpOnly: false })
            assert.strictEqual(theParams.httpOnly, undefined)
        })

        it('should set from contructor', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { httpOnly: true })
            assert.strictEqual(theParams.httpOnly, true)
        })

        it('should not include httpOnly flag when false', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { httpOnly: false }) 
            assert.strictEqual(theParams.httpOnly, undefined)
        })

        it('should throw when value is not boolean', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { httpOnly: 1 }), 
                { message: 'Cookie "foo" httpOnly option is invalid.' }
            )
        })

    })

    describe('"maxAge" option', function () {

        it('should set max-age', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.maxAge = 1000
            assert.deepStrictEqual(theParams.maxAge, 1000)
        })

        it('should set max-age from constructor', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { maxAge: 1000 })
            assert.strictEqual(theParams.maxAge, 1000)   
        })

        it('should set string max-age', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { maxAge: '1000' })
            assert.strictEqual(theParams.maxAge, 1000)
        })

        it('should set float max-age', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { maxAge: 3.99 })
            assert.strictEqual(theParams.maxAge, 3)
        })

        it('should return undefined', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            assert.strictEqual(theParams.maxAge, undefined)
        })

        it('should throw when max-age is not a number', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { maxAge: 'buzz' }), 
                { message: 'Cookie "foo" maxAge option is invalid.' }
            )
        })

        it('should throw when max-age is Infinity', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { maxAge: Infinity }), 
                { message: 'Cookie "foo" maxAge option is invalid.' }
            )
        })

    })

    describe('"path" option', function () {

        it('should set path', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.path = '/'
            assert.strictEqual(theParams.path, '/')
        })

        it('should set path from constructor', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { path: '/' })
            assert.strictEqual(theParams.path, '/')
        })

        it('should return undefined', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            assert.strictEqual(theParams.path, undefined)
        })

        it('should throw when invalid path', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { path: '/\n' }), 
                { message: 'Cookie "foo" path option is invalid.' }
            )
        })

    })

    describe('"priority" option', function () {

        it('should set "Low" priority', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.priority = 'loW'
            assert.strictEqual(theParams.priority, 'Low')
        })

        it('should set "Medium" priority', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.priority = 'mEdIum'
            assert.strictEqual(theParams.priority, 'Medium')
        })

        it('should set "High" priority', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.priority = 'HIGH'
            assert.strictEqual(theParams.priority, 'High')
        })

        it('should set priority from contructor', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { priority: 'Low' })
            assert.strictEqual(theParams.priority, 'Low')
        })

        it('should return undefined', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, {})
            assert.strictEqual(theParams.priority, undefined)
        })

        it('should throw when priority is invalid', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { priority: 'foo' }), 
                { message: 'Cookie "foo" priority option is invalid.' }
            )
        })

        it('should throw when priority is non-string', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { priority: 42 }), 
                { message: 'Cookie "foo" priority option is invalid.' }
            )
        })

    })

    describe('"sameSite" option', function () {

        it('should set to "Strict"', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.sameSite = 'StrIct'
            assert.strictEqual(theParams.sameSite, 'Strict')
        })

        it('should set to "Lax"', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.sameSite = 'lAx'
            assert.strictEqual(theParams.sameSite, 'Lax')
        })

        it('should set to "None"', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.sameSite = 'nOne'
            assert.strictEqual(theParams.sameSite, 'None')
        })

        it('should set priority from contructor', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { sameSite: 'Strict' })
            assert.strictEqual(theParams.sameSite, 'Strict')
        })

        it('should return undefined', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, {})
            assert.strictEqual(theParams.sameSite, undefined)
        })

        it('should throw when invalid sameSite', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { sameSite: 'foo' }), 
                { message: 'Cookie "foo" sameSite option is invalid.' }
            )
        })

        it('should throw when sameSite is non-string', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { sameSite: 42 }), 
                { message: 'Cookie "foo" sameSite option is invalid.' }
            )
        })

    })

    describe('"secure" option', function () {

        it('should set secure', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie)
            theParams.secure = true
            assert.deepStrictEqual(theParams.secure, true)
        })

        it('should not set secure if value is false', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { secure: false })
            assert.strictEqual(theParams.secure, undefined)
        })

        it('should set secure from constructor', function () {
            const theCookie = { name: 'foo' }
            const theParams = new CookieParams(theCookie, { secure: true })
            assert.strictEqual(theParams.secure, true)
        })

        it('should throw when secure is not boolean', function () {
            const theCookie = { name: 'foo' }
            assert.throws(
                () => new CookieParams(theCookie, { secure: 1 }), 
                { message: 'Cookie "foo" secure option is invalid.' }
            )
        })
        
    })

})

describe('Cookie test', function() {

    describe('"name" option', function () {

        it('should set name', function () {
            const theCookie = new Cookie('bar')
            theCookie.name = 'foo'
            assert.strictEqual(theCookie.name, 'foo')
        })

        it('should set name from constructor', function () {
            const theCookie = new Cookie('bar')
            assert.strictEqual(theCookie.name, 'bar')
        })

        it('should throw when name is not string', function () {
            assert.throws(
                () => new Cookie(1), 
                { message: 'Cookie name is not type of string or contain illegal characters.' }
            )
        })

        it('should throw when name is empty string', function () {
            assert.throws(
                () => new Cookie(''), 
                { message: 'Cookie name is not type of string or contain illegal characters.' }
            )
        })

        it('should throw when name contain invalid characters', function () {
            assert.throws(
                () => new Cookie('\n'), 
                { message: 'Cookie name is not type of string or contain illegal characters.' }
            )
        })

    })

    describe('"value" option', function () {

        it('should set value', function () {
            const theCookie = new Cookie('foo', 'bar')
            theCookie.value = 'bar'
            assert.strictEqual(theCookie.value, 'bar')
        })

        it('should set value from constructor', function () {
            const theCookie = new Cookie('foo')
            theCookie.value = 'foo'
            assert.strictEqual(theCookie.value, 'foo')
        })

        it('should throw when value is not string', function () {
            assert.throws(
                () => new Cookie('foo', 1), 
                { message: 'Cookie "foo" value is not string or contain illegal chracters.' }
            )
        })

        it('should throw when value contain invalid characters', function () {
            assert.throws(
                () => new Cookie('foo', '\n'), 
                { message: 'Cookie "foo" value is not string or contain illegal chracters.'}
            )
        })

    })

    describe('"params" option', function() {

        it('should set params', function () {
            const params = { secure: true, httpOnly: true }
            const theCookie = new Cookie('foo', 'bar')
            theCookie.params = params
            assert.deepStrictEqual(theCookie.params, new CookieParams(theCookie, params))
        })

        it('should set params from constructor', function () {
            const params = { secure: true, httpOnly: true }
            const theCookie = new Cookie('foo', 'bar', params)
            assert.deepStrictEqual(theCookie.params, new CookieParams(theCookie, params))
        })

        it('should set CookieParams instance', function () {
            const params = new CookieParams({}, { secure: true, httpOnly: true })
            const theCookie = new Cookie('foo', 'bar', params)
            assert.deepStrictEqual(theCookie.params, new CookieParams(theCookie, params))
        })

    })

    describe('"from" method', function () {

        it('should parse cookie from header', function () {
            const expected = [ new Cookie('foo', '123') ]
            const theCookies = Cookie.from('foo=123')
            assert.deepStrictEqual(theCookies, expected)
        })

        it('should use default value decoder', function () {
            const expected = [ new Cookie('foo', 'bar?') ]
            const theCookies = Cookie.from('foo=bar%3F')
            assert.deepStrictEqual(theCookies, expected)
        })

        it('should use custom value decoder', function () {
            const decoder = function (v) { return Buffer.from(v, 'base64').toString() }
            const expected = [ new Cookie('foo', 'bar') ]
            const theCookies = Cookie.from('foo=YmFy', decoder)
            assert.deepStrictEqual(theCookies, expected)
        })

        it('should ignore OWS', function () {
            const expected = [ new Cookie('FOO', 'bar'), new Cookie('baz', 'raz') ]
            const theCookies = Cookie.from('FOO    = bar;   baz  =   raz')
            assert.deepStrictEqual(theCookies, expected)
        })

        it('should parse escapes', async function(t) {
            const expected = [ new Cookie('FOO', '"bar"'), new Cookie('baz', 'raz') ]
            const theCookies = Cookie.from('FOO    = "\\"bar\\"";   baz  =   "raz"')
            assert.deepStrictEqual(theCookies, expected)
        })
    
        it('should parse empty values', function () {
            const expected = [ new Cookie('foo', ''), new Cookie('bar', '') ]
            const theCookies = Cookie.from('foo= ; bar=')
            assert.deepStrictEqual(theCookies, expected)
        })
    
        it('should return original value on escape error', function () {
            const expected = [ new Cookie('foo', '%1'), new Cookie('bar', 'bar') ]
            const theCookies = Cookie.from('foo=%1;bar=bar')
            assert.deepStrictEqual(theCookies, expected)
        })
    
        it('should ignore invalid cookies', function () {
            {
                const expected = [ new Cookie('foo', 'bar') ]
                const theCookies = Cookie.from('foo=bar;fizz  ;  buzz')
                assert.deepStrictEqual(theCookies, expected)
            }
            {
                const expected = [ new Cookie('foo', 'bar') ]
                const theCookies = Cookie.from('  fizz; foo=  bar')
                assert.deepStrictEqual(theCookies, expected)
            }
        })
    
        it('should ignore duplicates', function () {
            {
                const expected = [ new Cookie('foo', '%1'), new Cookie('bar', 'bar') ]
                const theCookies = Cookie.from('foo=%1;bar=bar;foo=boo')
                assert.deepStrictEqual(theCookies, expected)
            }
            {
                const expected = [ new Cookie('foo', 'false'), new Cookie('bar', 'bar') ]
                const theCookies = Cookie.from('foo=false;bar=bar;foo=true')
                assert.deepStrictEqual(theCookies, expected)
            }
            {
                const expected = [ new Cookie('foo', ''), new Cookie('bar', 'bar') ]
                const theCookies = Cookie.from('foo=;bar=bar;foo=boo')
                assert.deepStrictEqual(theCookies, expected)
            }
        })

        it('should URL-decode values', function () {
            {
                const expected = [ new Cookie('foo', 'bar=123456789&name=Magic+Mouse') ]
                const theCookies = Cookie.from('foo="bar=123456789&name=Magic+Mouse"')
                assert.deepStrictEqual(theCookies, expected)
            }
            {
                const expected = [ new Cookie('email', ' ",;/') ]
                const theCookies = Cookie.from('email=%20%22%2c%3b%2f"')
                assert.deepStrictEqual(theCookies, expected)
            }
        })

    })

    describe('"toString()" method', function () {

        it('should use default value encoder', function () {
            const theCookie = new Cookie('foo', 'bar?')
            assert.strictEqual(theCookie.toString(), 'foo=bar%3F')
        })

        it('should use custom value encoder', function () {
            const theCookie = new Cookie('foo', 'bar')
            theCookie.encoder = function (v) { return Buffer.from(v, 'utf8').toString('base64') }
            assert.strictEqual(theCookie.toString(), 'foo=YmFy')
        })

        it('should throw when returned value is invalid', function () {
            const theCookie = new Cookie('foo', 'bar')
            theCookie.encoder = function (v) { return v + '+ \n' }
            assert.throws(
                () => theCookie.toString(), 
                { message: 'Cookie "foo" encoded value is not string or contain illegal chracters.' }
            )
        })

        it('should use params', function () {
            const theCookie = new Cookie('foo', 'bar', { maxAge: 1000, secure: true, httpOnly: true, priority: 'Medium',  })
            assert.strictEqual(theCookie.toString(), 'foo=bar; Max-Age=1000; Secure; HttpOnly; Priority=Medium')
        })

        it('should convert expirest option to UTC Date string', function () {
            const theCookie = new Cookie('foo', 'bar', { expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)), path: "example.com", maxAge: 1000, secure: true, httpOnly: true, priority: 'Medium',  })
            assert.strictEqual(theCookie.toString(), 'foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT; Path=example.com; Max-Age=1000; Secure; HttpOnly; Priority=Medium')
        })

    })

})
