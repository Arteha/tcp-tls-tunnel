import axios from "axios";
import { TunnelHttpAgent, TunnelHttpsAgent } from "../src/agents";
import { CLIENTS, normalizeHeaders } from "../src/utils";


describe("Agents test suite", () =>
{
    const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36";
    const tunnelHttpAgent = new TunnelHttpAgent({
        host: "127.0.0.1",
        port: 1337,
        auth: undefined
    });
    const tunnelHttpsAgent = new TunnelHttpsAgent({
        host: "127.0.0.1",
        port: 1337,
        auth: undefined,
        client: CLIENTS.CHROME_83
    });

    it("Should properly do https request to howsmyssl via tunnel", done =>
    {
        axios.get("https://www.howsmyssl.com/a/check", {
            httpAgent: tunnelHttpAgent,
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
            .then(result =>
            {
                const grease = result.data["given_cipher_suites"].shift();
                expect(grease).toContain("TLS_GREASE");
                expect(result.data).toStrictEqual({
                    "given_cipher_suites": [
                        // "TLS_GREASE_IS_THE_WORD_4A",
                        "TLS_AES_128_GCM_SHA256",
                        "TLS_AES_256_GCM_SHA384",
                        "TLS_CHACHA20_POLY1305_SHA256",
                        "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
                        "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
                        "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
                        "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                        "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
                        "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256",
                        "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
                        "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
                        "TLS_RSA_WITH_AES_128_GCM_SHA256",
                        "TLS_RSA_WITH_AES_256_GCM_SHA384",
                        "TLS_RSA_WITH_AES_128_CBC_SHA",
                        "TLS_RSA_WITH_AES_256_CBC_SHA"
                    ],
                    "ephemeral_keys_supported": true,
                    "session_ticket_supported": true,
                    "tls_compression_supported": false,
                    "unknown_cipher_suite_supported": false,
                    "beast_vuln": false,
                    "able_to_detect_n_minus_one_splitting": false,
                    "insecure_cipher_suites": {},
                    "tls_version": "TLS 1.3",
                    "rating": "Probably Okay"
                })
                done();
            })
            .catch(e => done.fail(e))
    })

    it("Should properly do http request to google via tunnel", done =>
    {
        axios.get("http://www.google.com/", {
            maxRedirects: 0,
            httpAgent: tunnelHttpAgent,
            httpsAgent: tunnelHttpsAgent,
            headers: normalizeHeaders({
                Host: "www.google.com",
                Connection: "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": USER_AGENT,
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
            }),
            validateStatus: status => [2, 3].includes(Math.floor(status / 100)) // accept only 2xx and 3xx statuses
        })
            .then(result => done())
            .catch(e => done.fail(e))
    })
});