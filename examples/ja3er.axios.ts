import axios from "axios";
import { TunnelHttpsAgent, CLIENTS, normalizeHeaders } from "../src";


const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36";
const tunnelHttpsAgent = new TunnelHttpsAgent({
    host: "127.0.0.1", // tunnel address
    port: 1337, // tunnel port
    auth: undefined, /* Optional. If tunneling server requires authentication, then pass credentials:
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

axios.get("https://ja3er.com/json", {
    httpsAgent: tunnelHttpsAgent,
    headers: normalizeHeaders({
        Host: "ja3er.com",
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