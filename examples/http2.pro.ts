import { connect, constants } from "http2";
import { CLIENTS, TunnelsFactory } from "../src";
import { URL } from "url";


const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36";

(async () =>
{
    const url = new URL("https://http2.pro/api/v1");
    const [socket] = await TunnelsFactory.establishSocket({
        host: "104.248.43.30",
        // host: "127.0.0.1",
        port: 1337,
        auth: {
            login: "test1",
            password: "467jw2d53x82FAGHSw",
        },
        client: CLIENTS.CHROME,
        secure: true,
        http2: true,
        target: {
            host: url.hostname,
            port: 443,
            serverName: url.hostname
        }
    });

    const session = connect(url, {
        createConnection: () => socket
    }, ((session, socket) =>
    {
        // console.log(session);
        // console.log(socket);
    }));

    const req = session.request({[constants.HTTP2_HEADER_PATH]: url.pathname});

    req.on("response", (headers, flags) =>
    {
        console.log("response:", {headers, flags});
        const chunks: Buffer[] = [];
        req.on("data", chunk => chunks.push(chunk));
        req.on("end", () => console.log(Buffer.concat(chunks).toString(), 1));
    });

    const req2 = session.request({path: url.pathname});

    req2.on("response", (headers, flags) =>
    {
        console.log("response:", {headers, flags});
        const chunks: Buffer[] = [];
        req2.on("data", chunk => chunks.push(chunk));
        req2.on("end", () => console.log(Buffer.concat(chunks).toString(), 2));
    });
})();