declare module "@vikhola/cookies" {

    interface ICookieParams {
        path?: string
        domain?: string
        secure?: boolean
        maxAge?: number
        expires?: Date
        httpOnly?: boolean
        priority?: string
        sameSite?: string
    }
    
    interface ICookie {
        /**
         * Cookie name.
         */
        name: string
        /**
         * Cookie value.
         */
        value: string
        /**
         * The `cookie.params` represent cookie client attributes.
         */
        params: ICookieParams
        /**
         * Optional cookie value encode function. By default {@link encodeURIComponent}
         */
        encoder: (value: string) => string
        /**
         * The `cookie.toString()` method return a string representation suitable to be sent as HTTP headers. 
         * 
         * @throws Error if header isn`t string. 
         * @returns Return Cookie string representation.
         */
        toString(): string
    }
    
    interface IUnsignedCookie extends ICookie {
        /**
         * Cookie validity.
         * 
         * If the Cookie value signature does not match any secret, it will be `false`, otherwise `true`.
         */
        valid: boolean
        /**
         * Cookie renew indicates is should be cookie resigned.
         * 
         * If the Cookie value signature matches some other secret from secrets array, than the current, 
         * it will be `false`, otherwise `true`.
         */
        renew: boolean
    }
    
    export class Cookie implements ICookie {
        /**
         * Get cookie name.
         */
        get name(): string
        /**
         * Set cookie name.
         * 
         * @throws Error if name is not string or contain invalid chraracters.
         */
        set name(name: string)
        /**
         * Get cookie value.
         */
        get value(): string
        /**
         * Set cookie value.
         * 
         * @throws Error if value is not string or contain invalid chraracters.
         */
        set value(value: string)
        /**
         * Get cookie params.
         */
        get params(): ICookieParams
        /**
         * Set cookie params.
         */
        set params(params: ICookieParams)
        /**
         * Optional cookie value encode function. By default {@link encodeURIComponent}
         */
        encoder: (value: string) => string
        /**
         * The Cookie constructor accepts name, value and optional parameters.
         * 
         * @param name Cookie name.
         * @param value Optional Cookie value.
         * @param params Optional Cookie params
         */
        constructor(name?: string, value?: string, params?: ICookieParams)
        /**
         * The `cookie.from()` static method parses cookies from provided string and return
         * array of {@link Cookie}s.
         * 
         * If a cookie with the same name already exists during parsing, the new cookie will be ignored.
         * 
         * @param header HTTP header to parse.
         * @param decoder Optional cookie value decode function. By default {@link decodeURIComponent}
         * @returns Array of {@link Cookie}.
         */
        static from(header: string, decoder?: (value: string) => string): Array<Cookie>
        /**
         * The `cookie.toString()` method return a string representation suitable to be sent as HTTP headers. 
         * 
         * @throws Error if header isn`t string. 
         * @returns Return Cookie string representation.
         */
        toString(): string
    }
    
    export class CookieSigner {
        /**
         * Get signer secrets.
         */
        get secrets(): Array<string> | Array<Buffer>
        /**
         * Set signer secrets.
         * 
         * @throws Error if secrets is not array or contain something else than strings or Buffers.
         */
        set secrets(secrets:Array<string> | Array<Buffer>)
        /**
         * Get signer secrets.
         */
        get algorithm(): string
        /**
         * Set signer alghorithm.
         * 
         * @throws Error if algorithm is invalid or not supported.
         */
        set algorithm(algorithm: string) 
        /**
         * The CookieSigner constructor accepts secrets and optional algorithm parameter.
         * 
         * @param secrets Secrets to use when signing and unsigning cookies.
         * @param algorithm Algorithm to use when signing and unsigning cookies. By default SHA256.
         */
        constructor(secrets: string | Buffer | Array<string> | Array<Buffer>, algorithm?: string)
        /**
         * The `signer.sign()` method takes a `Cookie` as an argument, creates a signed value using the current algorithm and secret, 
         * and then returns a new instance of the `Cookie` class with it.
         * 
         * The signer will sign the cookie value with the first secret from the `secrets` parameter.
         * 
         * @param cookie The {@link Cookie} to sign.
         * @throws Error if cookie is not instance of Cookie or cookie value is empty.
         * @returns New {@link Cookie} instance with signed value.
         */
        sign(cookie: Cookie): Cookie
        /**
         * The `signer.unsign()` method accepts `Cookie` as argument, tries to unsign value by current algorithm and secret, 
         * after that return a new instance of `Cookie` class with it.
         * 
         * The signer will iterate over the `secrets` array to see if any of the available keys 
         * are able to decode the given signed cookie. 
         * 
         * @param cookie The {@link Cookie} to unsign.
         * @throws Error if cookie is not instance of Cookie or cookie value is empty.
         * @returns New {@link Cookie} instance with unsigned value with additional properties.
         */
        unsign(cookie: Cookie): IUnsignedCookie
    }

}
