# @vikhola/cookies

# About
Basic HTTP cookie parser and serializer for HTTP servers.

# Installation

```sh
$ npm i @vikhola/cookies
```

# Usage

Cookie could be required as ES6 module 

```js
import { Cookie, CookieSigner } from '@vikhola/cookies'
```

Or as commonJS module.

```js
const { Cookie, CookieSigner } = require('@vikhola/cookies')
```

# Cookie

The Cookie constructor accepts name, value and optional parameters.

```js
const cookie = new Cookie('foo', 'bar', { maxAge: 1000 })
```

### cookie.name 

The `cookie.name` represented by a getter that returns current cookie name and by a setter thats set current cookie name.

```js
const cookie = new Cookie('foo')
// print: 'foo'
console.log(cookie.name)

cookie.name = 'bar'
// print: 'bar'
console.log(cookie.name)
```

If cookie value is not string, contain invalid characters, or empty string an Error will be throw.

```js
const cookie = new Cookie('foo')

// throws an Error
cookie.name = 1
```

### cookie.value 

The `cookie.value` has a getter that returns current cookie value and by a setter thats set current cookie value.

```js
const cookie = new Cookie('foo', 'bar')

// print: 'bar'
console.log(cookie.value)

cookie.value = 'foo'
// print: 'foo'
console.log(cookie.value)
```

By default `cookie.value` is set to empty string.

```js
const cookie = new Cookie('foo')

// print: ''
console.log(cookie.value)
```

As with `cookie.name`, if the value is not a string or contains invalid characters, an error will be thrown, except for an empty string case.

```js
const cookie = new Cookie('foo', 'bar')

cookie.value = ''
// print: ''
console.log(cookie.value)

// throws an Error
cookie.value = 1
```

### cookie.params 

The `cookie.params` is gettes/setter pair that work through `CookieParams` class. This class represent and intercept all calls to cookie client attributes such as:

* [domain][rfc-6265-5.2.3]
* [expires][rfc-6265-5.2.1]
* [httpOnly][rfc-6265-5.2.6]
* [maxAge][rfc-6265-5.2.2]
* [path][rfc-6265-5.2.4]
* [priority][rfc-west-cookie-priority-00-4.1]
* [sameSite][rfc-6265bis-09-5.4.7]
* [secure][rfc-6265-5.2.5]

Interception implemented through attributes getter/setter pairs.

```js
const cookie = new Cookie('foo', 'bar', { maxAge: 1000 })
// print: {}
console.log(cookie.params)

// print: 1000
console.log(cookie.params.maxAge)

cookie.params.maxAge = 2000
// print: 2000
console.log(cookie.params.maxAge)

// throws an Error
cookie.params.maxAge = 'foo'
```

If `cookie.params` getter returns `CookieParams` class instance, then the setter clear current cookie client attributes and pass provided object properties through `CookieParams` class instance.

```js
const cookie = new Cookie('foo', 'bar', { maxAge: 1000 })

cookie.params = { maxAge: 2000 }
// print: 2000
console.log(cookie.params.maxAge)

// throws an Error
cookie.params = { maxAge: 'foo' }
```

### cookie.encoder

The `cookie.encoder` represent a function that will be used to encode cookie values. By default it is `encodeURIComponent`.

```js
const cookie = new Cookie('foo')
// print: [Function: encodeURIComponent]
console.log(cookie.encoder)
```


### Cookie.from(header, decoder)

The `Cookie.from()` static method parses cookies from provided string and return an array of `Cookie` instances.

```js
const cookies = Cookie.from('foo=123')
// print: 'Cookie { name: 'foo', value: '123', params: {} }'
console.log(cookies[0])

```

If a cookie with the same name already exists during parsing, the new cookie will be ignored.

```js
const cookies = Cookie.from('foo=123; foo=124')
// print: 1
console.log(cookies.length)

// print: 'Cookie { name: 'foo', value: '123', params: {} }'
console.log(cookies[0])
```

If a decoding function is provided, it will be used to decode cookie values during parsing.

```js
const decoder = function (v) { return Buffer.from(v, 'base64').toString() }

const cookies = Cookie.from('foo=YmFy', decoder)
// print: 'Cookie { name: 'foo', value: 'bar', params: {} }'
console.log(cookies[0])
```

### cookie.toString()

The `cookie.toString()` method returns a string representation suitable for sending as an HTTP header.

```js
const cookie = new Cookie('foo', 'bar', { maxAge: 1000 })
// print: foo=bar; Max-Age=1000
console.log(cookie.toString())
```

If an encoding function is provided, it will be used to encode cookie values.

```js
const encoder = function (v) { return Buffer.from(v, 'utf8').toString('base64') }

const cookie = new Cookie('foo', 'bar')
cookie.encoder = encoder
// print: foo=YmFy
console.log(cookie.toString())
```

## CookieSigner

The CookieSigner constructor two arguments, secrets and optional algorithm.

```js
const cookieSigner = new CookieSigner('secret', 'sha512')
```

### signer.secrets

The `signer.secrets` defines secret that will be used under cookie sign creation. This property implemented through getter/setter pair. Signer secrets should be arrays of string or buffers, but constructor also additionally accepts simple strings and buffers.

```js
const cookieSigner = new CookieSigner('secret')
// print: ['secret']
console.log(cookieSigner.secrets)

cookieSigner.secrets = [Buffer.from('secret')]
// print: [ <Buffer 73 65 63 72 65 74> ]
console.log(cookieSigner.secrets)
```

If secret value is not array of strings or buffers an Error will be throw.

```js
const cookieSigner = new CookieSigner('secret')

// throws an Error
cookieSigner.secrets = 'foo'
```

### signer.algorithm

The `signer.algorithm` defines algorithm that will be used under sign creation is property with getter/setter pair. This is optional argument, but by default it is set to `sha256`.

```js
const cookieSigner = new CookieSigner('secret')
// print: 'sha256'
console.log(cookieSigner.algorithm)

cookieSigner.algorithm = 'sha512'
// print: 'sha512'
console.log(cookieSigner.algorithm)
```

If algorithm value is not array of strings or buffers an Error will be throw.

```js
const cookieSigner = new CookieSigner('secret')

// throws an Error
cookieSigner.algorithm = 'foo'
```

### signer.sign() 

The `signer.sign()` method takes a `Cookie` as an argument, creates a signed value using the current algorithm and secret, and then returns a new instance of the `Cookie` class with it.

```js
const cookie = new Cookie('foo', 'bar')
const cookieSigner = new CookieSigner('secret')

// print: bar.aMcN2wzx4XLp9w3CPrwNb6PtTzECzkMPIiEfDqVDk4k
console.log(cookieSigner.sign(cookie).value)
```

If provided arguments is not instance of `Cookie` an Error will be throw.

```js
const cookie = { name: 'foo', value: 'bar' }
const cookieSigner = new CookieSigner('secret')

// throws an Error
cookieSigner.sign(cookie)
```

Also Error will be throw if cookie value is undefined or empty string.

```js
const cookie = new Cookie('foo')
const cookieSigner = new CookieSigner('secret')

// throws an Error
cookieSigner.sign(cookie)
```

### signer.unsign() 

The `signer.unsign()` method accepts `Cookie` class instance, validates it using current algorithm and secrets and return new `Cookie` instance with unsigned `value`, `valid` and `renew` properties.

```js
const cookie = new Cookie('foo', 'bar.aMcN2wzx4XLp9w3CPrwNb6PtTzECzkMPIiEfDqVDk4k')
const cookieSigner = new CookieSigner('secret')

// print: bar
console.log(cookieSigner.unsign(cookie).value)
```

If the cookie value signature is not valid, after unsigning the cookie properties `valid` will be set to false and `value` to empty string.

```js
const cookie = new Cookie('foo', 'bar.xbb9p6DNYmoTZdJUFs50CV8scZTQjnLM67Rf3lW9aUU')
const cookieSigner = new CookieSigner('secret')

const unsignedCookie = cookieSigner.unsign(cookie)

// print: ''
console.log(unsignedCookie.value)
// print: false
console.log(unsignedCookie.valid)
```

As in the `signer.sign()` method if provided arguments is not instance of `Cookie` an Error will be throw, except empty string case where `valid` option will be set to false.

```js
const cookie = { name: 'foo', value: 'bar' }
const cookieSigner = new CookieSigner('secret')

// throws an Error
cookieSigner.unsign(cookie)
```

The `renew` property indicates is the cookie value signature matches some other secret from secrets array, than the current, it will be `false`, otherwise `true`. It can be useful with secrets rotation.

```js
const secrets = ['secret-1']
const cookie = new Cookie('foo', 'bar')
const cookieSigner = new CookieSigner(secrets)

const signedCookie = cookieSigner.sign(cookie)
secrets.unshift('secret')
const unsignedCookie = cookieSigner.unsign(signedCookie)

// print: bar
console.log(unsignedCookie.value)
// print: true
console.log(unsignedCookie.renew)
// print: true
console.log(unsignedCookie.valid)
```

## References

- [RFC 6265: HTTP State Management Mechanism][rfc-6265]
- [Same-site Cookies][rfc-6265bis-09-5.4.7]

[rfc-west-cookie-priority-00-4.1]: https://tools.ietf.org/html/draft-west-cookie-priority-00#section-4.1
[rfc-6265bis-09-5.4.7]: https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-09#section-5.4.7
[rfc-6265]: https://tools.ietf.org/html/rfc6265
[rfc-6265-5.1.4]: https://tools.ietf.org/html/rfc6265#section-5.1.4
[rfc-6265-5.2.1]: https://tools.ietf.org/html/rfc6265#section-5.2.1
[rfc-6265-5.2.2]: https://tools.ietf.org/html/rfc6265#section-5.2.2
[rfc-6265-5.2.3]: https://tools.ietf.org/html/rfc6265#section-5.2.3
[rfc-6265-5.2.4]: https://tools.ietf.org/html/rfc6265#section-5.2.4
[rfc-6265-5.2.5]: https://tools.ietf.org/html/rfc6265#section-5.2.5
[rfc-6265-5.2.6]: https://tools.ietf.org/html/rfc6265#section-5.2.6
[rfc-6265-5.3]: https://tools.ietf.org/html/rfc6265#section-5.3

## License

[MIT](https://github.com/vikhola/cookies/blob/main/LICENSE)