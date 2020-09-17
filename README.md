<!-- TITLE/ -->

<h1>TCP TLS Tunnel</h1>

<!-- /TITLE -->

<!-- BADGES/ -->
<span class="badge-npmversion"><a href="https://npmjs.org/package/tcp-tls-tunnel" title="View this project on NPM"><img src="https://img.shields.io/npm/v/tcp-tls-tunnel.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/tcp-tls-tunnel" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/tcp-tls-tunnel.svg" alt="NPM downloads" /></a></span>
<span class="badge-typescript"><a href="https://github.com/Arteha/tcp-tls-tunnel" title="View this project on GitHub"><img src="https://img.shields.io/npm/types/tcp-tls-tunnel.svg" alt="NPM downloads" /></a></span>
<!-- /BADGES -->

Provides NodeJS Http and Https agents that establish TCP and TLS connections via our modified poxy server.
Our TLS Layer pass ciphers and has SSL session ticket support by default.
If you are really interested in testing it for free, you can find out more details in our [Discord Channel](https://discord.gg/4HRVxNP).

Installation: `npm i tcp-tls-tunnel`

Discord Channel: [ TCP TLS Tunnel](https://discord.gg/4HRVxNP)

## Usage examples

Lets test it with [axios](https://npmjs.org/package/axios) and [request](https://npmjs.org/package/request) so add import statements:
```typescript
import axios from "axios";
import * as request from "request";
```

Firstly we have to create https Agent for https request:
```typescript
import { TunnelHttpsAgent, CLIENTS } from "tcp-tls-tunnel";

const tunnelHttpsAgent = new TunnelHttpsAgent({
    host: "127.0.0.1", // tunnel address
    port: 1337, // tunnel port
    auth: undefined, /* Optional, If tunneling server requires authentication, then pass credentials:
    auth: {
        login: "<your login>",
        password: "<your login>",
    }*/
    proxy: undefined, /* or you can easilly use your own http proxy
    proxy: {
        host: "your.proxy.host",
        port: 1234,
        auth: { // optional
            login: "<your proxy login>",
            password: "<your proxy password>"
        }
    }
    */
    client: CLIENTS.CHROME // also can simulate "FIREFOX" or "IOS". Optional. Default: "CHROME"
});
```

You can also use our util to fix mistakes in headers names and sort them correctly:
```typescript
import { normalizeHeaders } from "tcp-tls-tunnel";
```

Declare User-Agent constant for the following request:
```typescript
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36";
```

Axios usage:
```typescript
axios.get("https://www.howsmyssl.com/a/check", {
    httpsAgent: tunnelHttpsAgent,
    headers: normalizeHeaders({
        Host: "www.howsmyssl.com",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
    })
})
    .then(result => console.log({axios: result.data}))
    .catch(e => console.error(e));
```
Output:
```javascript
{ axios:
   { given_cipher_suites:
      [ 'TLS_GREASE_IS_THE_WORD_BA',
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
        'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
        'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
        'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
        'TLS_RSA_WITH_AES_128_GCM_SHA256',
        'TLS_RSA_WITH_AES_256_GCM_SHA384',
        'TLS_RSA_WITH_AES_128_CBC_SHA',
        'TLS_RSA_WITH_AES_256_CBC_SHA' ],
     ephemeral_keys_supported: true,
     session_ticket_supported: true,
     tls_compression_supported: false,
     unknown_cipher_suite_supported: false,
     beast_vuln: false,
     able_to_detect_n_minus_one_splitting: false,
     insecure_cipher_suites: {},
     tls_version: 'TLS 1.3',
     rating: 'Probably Okay' } }
```

Request usage:
```typescript
request.get("https://www.howsmyssl.com/a/check", {
    agent: tunnelHttpsAgent,
    headers: normalizeHeaders({
        Host: "www.howsmyssl.com",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
    })
}, ((error, response, body) => console.log({request: JSON.parse(body)})));
```
Output:
```javascript
{ request:
   { given_cipher_suites:
      [ 'TLS_GREASE_IS_THE_WORD_3A',
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
        'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
        'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
        'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
        'TLS_RSA_WITH_AES_128_GCM_SHA256',
        'TLS_RSA_WITH_AES_256_GCM_SHA384',
        'TLS_RSA_WITH_AES_128_CBC_SHA',
        'TLS_RSA_WITH_AES_256_CBC_SHA' ],
     ephemeral_keys_supported: true,
     session_ticket_supported: true,
     tls_compression_supported: false,
     unknown_cipher_suite_supported: false,
     beast_vuln: false,
     able_to_detect_n_minus_one_splitting: false,
     insecure_cipher_suites: {},
     tls_version: 'TLS 1.3',
     rating: 'Probably Okay' } }
```

If you want to do an http request through our tunnel, you can also use `TunnelHttpAgent`:

```typescript
import { TunnelHttpAgent } from "tcp-tls-tunnel";
```
