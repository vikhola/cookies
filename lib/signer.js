'use strict';

const crypto = require('crypto')
const { Cookie } = require('./cookie.js')

const BASE64_PATTERN = /=/g

const kSecrets = Symbol('secrets')
const kAlgorithm = Symbol('algorithm')

class CookieSignerSecretError extends Error {
    constructor(key) {
        super('Signer secret must be an array containing strings or buffers.')
    }
}

class CookieSignerAlgorithmError extends Error {
    constructor(key) {
        super(`Signer algorithm "${key}" not supported.`)
    }
}

class CookieSignerTypeError extends Error {
    constructor(name) {
        super(`Signer cookie should be instance of Cookie.`)
    }
}

class CookieSignerValueError extends Error {
    constructor(name) {
        super(`Signer cookie "${name}" is undefined or empty string.`)
    }
}

class CookieSigner {

    constructor(secrets, algorithm = 'sha256') {
        secrets = Array.isArray(secrets) ? secrets : [secrets]
        this.secrets = secrets
        this.algorithm = algorithm
        this.signingKey = this.secrets[0]
    }

    get secrets() {
        return this[kSecrets]
    }

    set secrets(secrets) {
        if(!Array.isArray(secrets))
            throw new CookieSignerSecretError()

        for (const secret of secrets)
            if (typeof secret !== 'string' && Buffer.isBuffer(secret) === false)
                throw new CookieSignerSecretError()

        this[kSecrets] = secrets
    }

    get algorithm() {
        return this[kAlgorithm]
    }

    set algorithm(algorithm) {
        try {
            crypto.createHmac(algorithm, crypto.randomBytes(16))
        } catch (e) {
            throw new CookieSignerAlgorithmError(algorithm)
        } 
        this[kAlgorithm] = algorithm
    }

    _sign(value, algorithm, secret) {
        return crypto
            .createHmac(algorithm, secret)
            .update(value)
            .digest('base64')
            .replace(BASE64_PATTERN, '')
    }

    sign(cookie) {
        if(!(cookie instanceof Cookie))
            throw new CookieSignerTypeError()
        if(!cookie.value) 
            throw new CookieSignerValueError(cookie.name)

        const value = cookie.value
        const sign = this._sign(value, this.algorithm, this.secrets[0])
        return new Cookie(cookie.name, `${value}.${sign}`, cookie.params)
    }

    unsign(cookie) {
        if(!(cookie instanceof Cookie))
            throw new CookieSignerTypeError()

        let valid = false 
        let renew = false 
        let value = ''
        const actual = Buffer.from(cookie.value.slice(cookie.value.lastIndexOf('.') + 1))
        const payload = cookie.value.slice(0, cookie.value.lastIndexOf('.'))

        for (const secret of this.secrets) {
            const expected = Buffer.from(this._sign(payload, this.algorithm, secret))
            if (expected.length === actual.length && crypto.timingSafeEqual(expected, actual)) {
                valid = true
                renew = secret !== this.secrets[0]
                value = payload
                break
            }
        }

        return Object.assign(new Cookie(cookie.name, value, cookie.params), { valid, renew })
    }

}

module.exports = { CookieSigner }