'use strict';

const util = require('util');

const QESC_PATTERN = /\\([\u000b\u0020-\u00ff])/g
const KEY_PATTERN = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/
const VALUE_PATTERN = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/
const COOKIE_PATTERN = / *([0-9A-Za-z!#$%&'*+-.^_`|~]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[0-9A-Za-z!#$%&'()*+-./:<=>?@[\]^_`{|}~]+|) */g

const RESERVED = { 
    'expires'   : 'Expires', 
    'path'      : 'Path',  
    'domain'    : 'Domain', 
    'maxAge'    : 'Max-Age', 
    'secure'    : 'Secure', 
    'httpOnly'  : 'HttpOnly', 
    'sameSite'  : 'SameSite', 
    'priority'  : 'Priority' 
}
const FLAGS = [ 'secure', 'httpOnly' ]
const HEADER = 'Set-Cookie'

const kCookie = Symbol('cookie')
const kParams = Symbol('params')

function safeDecodeURIComponent(value) {
    try { 
        return value.indexOf('%') !== -1 ? 
            decodeURIComponent(value) : value     
    } catch{ 
        return value
    }
}

function capitalize(value) {
    const lower = value.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
} 

class CookieNameError extends Error {
    constructor(name) {
        super(`Cookie name is not type of string or contain illegal characters.`)
    }
}

class CookieValueError extends Error {
    constructor(name) {
        super(`Cookie "${name}" value is not string or contain illegal chracters.`)
    }
}

class CookieOutputError extends Error {
    constructor(name) {
        super(`Cookie "${name}" encoded value is not string or contain illegal chracters.`)
    }
}

class CookieParamsError extends Error {
    constructor(name, key) {
        super(`Cookie "${name}" ${key} option is invalid.`)
    }
}

class CookieParams {

    constructor(cookie, params = {}) {
        this[kParams] = {}
        this[kCookie] = cookie
        for(const key in RESERVED) 
            if(params[key] != null) this[key] = params[key]
    }

    get secure() {
        return this[kParams].secure
    }

    set secure(value) {
        if(typeof value !== 'boolean')
            throw new CookieParamsError(this[kCookie].name,'secure')
        if(value) 
            this[kParams].secure = value
    }

    get httpOnly() {
        return this[kParams].httpOnly
    }

    set httpOnly(value) {
        if(typeof value !== 'boolean')
            throw new CookieParamsError(this[kCookie].name,'httpOnly')
        if(value) 
            this[kParams].httpOnly = value
    }

    get domain() {
        return this[kParams].domain
    }

    set domain(value) {
        if(typeof value !== 'string' || (value && !VALUE_PATTERN.test(value)))
            throw new CookieParamsError(this[kCookie].name,'domain')
        this[kParams].domain = value
    }

    get path() {
        return this[kParams].path
    }

    set path(value) {
        if(typeof value !== 'string' || (value && !VALUE_PATTERN.test(value)))
            throw new CookieParamsError(this[kCookie].name,'path')
        this[kParams].path = value
    }

    get expires() {
        return this[kParams].expires
    }

    set expires(value) {
        if(!util.types.isDate(value) || isNaN(value.valueOf()))
            throw new CookieParamsError(this[kCookie].name,'expires')
        this[kParams].expires = value
    }

    get maxAge() {
        return this[kParams].maxAge
    }

    set maxAge(value) {
        if(isNaN(value) || !isFinite(value))
            throw new CookieParamsError(this[kCookie].name,'maxAge')
        this[kParams].maxAge = Math.floor(value)
    }

    get priority() {
        return this[kParams].priority
    }

    set priority(value) {
        if(typeof value !== 'string')
            throw new CookieParamsError(this[kCookie].name,'priority')
        value = capitalize(value)
        if(!['Low', 'Medium', 'High'].includes(value))
            throw new CookieParamsError(this[kCookie].name,'priority')
        this[kParams].priority = value
    }

    get sameSite() {
        return this[kParams].sameSite
    }

    set sameSite(value) {
        if(typeof value !== 'string')
            throw new CookieParamsError(this[kCookie].name,'sameSite')
        value = capitalize(value)
        if(!['Strict', 'Lax', 'None'].includes(value))
            throw new CookieParamsError(this[kCookie].name,'sameSite')
        this[kParams].sameSite = value
    }

}

class Cookie {

    constructor(name, value = '', params = {}) {
        this.name = name
        this.value = value
        this.params = params   
        this.encoder = encodeURIComponent
    }

    get name() {
        return this._name
    }

    set name(name) {
        if(typeof name !== 'string' || !KEY_PATTERN.test(name))
            throw new CookieNameError();
        this._name = name
    }

    get value() {
        return this._value
    }

    set value(value) {
        if(typeof value !== 'string' || (value && !VALUE_PATTERN.test(value)))
            throw new CookieValueError(this.name);
        this._value = value
    }

    get params() {
        return this._params
    }

    set params(params) {
        this._params = new CookieParams(this, params)
    }

    static from(header, decoder = safeDecodeURIComponent) {
        if(typeof header !== 'string') 
            return []
        let key
        let match
        let value
        const cookies = new Map()
        while ((match = COOKIE_PATTERN.exec(header))) {
            key = match[1]
            value = match[2]
            if(cookies.has(key)) continue;
            if (value.charCodeAt(0) === 0x22) {
                value = value.slice(1, value.length - 1)
                QESC_PATTERN.test(value) && (value = value.replace(QESC_PATTERN, '$1'))
            }
            cookies.set(key, new Cookie(key, decoder(value)))
        }
        return Array.from(cookies.values())
    }

    toString() {
        const name = this.name
        const value = this.encoder(this.value)
        const params = this._params[kParams]
        const items = [ `${name}=${value}` ]

        if(!value || typeof value !== 'string' || !VALUE_PATTERN.test(value))
            throw new CookieOutputError(this.name)

        for(const key in params) {
            let value = params[key]
            if(value == null)
                continue;
            if(FLAGS.includes(key)) {
                if(value)
                    items.push(RESERVED[key])
            } else {
                if(key === 'expires')
                    value = value.toUTCString()
                items.push(`${RESERVED[key]}=${value}`)
            }
        }

        return `${items.join('; ')}`
    }

}

module.exports = { 
    Cookie,
    CookieParams,
}