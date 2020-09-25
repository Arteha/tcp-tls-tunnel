import { Socket } from "net";
import * as http from "http";
import { Address, Credentials, Proxy } from "../types";
import { TunnelException, TunnelResponseException } from "../exceptions";
import { IncomingMessage } from "http";


export enum CLIENTS
{
    CHROME = "CHROME", // CHROME_83
    CHROME_58 = "CHROME_58",
    CHROME_62 = "CHROME_62",
    CHROME_70 = "CHROME_70",
    CHROME_72 = "CHROME_72",
    CHROME_83 = "CHROME_83",

    FIREFOX = "FIREFOX", // FIREFOX_65
    FIREFOX_55 = "FIREFOX_55",
    FIREFOX_56 = "FIREFOX_56",
    FIREFOX_63 = "FIREFOX_63",
    FIREFOX_65 = "FIREFOX_65",

    IOS = "IOS", // IOS_12_1
    IOS_11_1 = "IOS_11_1",
    IOS_12_1 = "IOS_12_1"
}

export type Clients = keyof typeof CLIENTS

export type TargetOptions = Address & {
    serverName?: string
}

export type TunnelOptions = Address & {
    auth?: Credentials // Required if tunnel has authentication
    proxy?: Proxy | null
}

export type SecureTunnelOptions = TunnelOptions & {
    client?: Clients // TLS client that tunnel will apply.
}

export type SocketOptions = SecureTunnelOptions & {
    secure?: boolean
    target: TargetOptions
}

export class TunnelsFactory
{
    public static establishSocket(options: SocketOptions, timeout: number = 2 * 60 * 1000): Promise<Socket>
    {
        return new Promise<Socket>((resolve, reject) =>
        {
            const {auth, proxy} = options;
            const headers = {
                Host: options.host,
                Connection: "keep-alive",
                Authorization: auth
                    ? `Basic ${Buffer.from(`${auth.login}:${auth.password}`).toString("base64")}`
                    : undefined,
                Secure: options.secure ? "1" : "0",
                Client: options.client || undefined,
                Proxy: proxy
                    ? proxy.auth
                        ? `${proxy.auth.login}:${proxy.auth.password}@${proxy.host}:${proxy.port}`
                        : `${proxy.host}:${proxy.port}`
                    : undefined,
                "Server-Name": options.target.serverName || undefined
            };

            for (const n in headers)
            {
                if (headers[n] == null)
                    delete headers[n];
            }

            const req = http.request({
                host: options.host,
                port: Number(options.port),
                method: "CONNECT",
                path: `${options.target.host}:${options.target.port}`,
                headers
            });

            const off = (becauseOfTimeout?: boolean) =>
            {
                clearTimeout(timeoutId);
                req.off("error", onError);
                req.off("close", onClose);
                req.off("connect", onConnect);

                if (becauseOfTimeout)
                {
                    // prevent process crashing of "socket hang up" errors etc.
                    req.on("error", () => void 0);
                }
            }

            const onTimeout = () =>
            {
                off(true);
                req.abort();
                reject(new TunnelException("TUNNEL_CONNECTION_TIMED_OUT"));
            }

            const onError = (e: Error) =>
            {
                off();
                req.abort();
                reject(new TunnelException(e.message || `${e}`));
            }

            const onClose = () =>
            {
                off();
                req.abort();
                reject(new TunnelException("TUNNEL_CONNECTION_UNEXPECTEDLY_CLOSED"));
            }

            const onConnect = (res: IncomingMessage, socket: Socket) =>
            {
                const newTimeout = timeout - (Date.now() - startedAt);
                off();

                if (res.statusCode == 200)
                    resolve(socket);
                else
                {
                    const chunks: Array<Buffer> = [];
                    const onData = (chunk: Buffer) => chunks.push(chunk);

                    const onTimeout = () =>
                    {
                        off(true);
                        reject(new TunnelException("TUNNEL_CONNECTION_TIMED_OUT"));
                    }

                    const onError = (e: Error) =>
                    {
                        off();
                        reject(new TunnelException(e.message || `${e}`))
                    }

                    const onEnd = () =>
                    {
                        off();
                        reject(new TunnelResponseException(res.statusCode || 0, res.headers["error"]?.toString()));
                    }

                    const off = (becauseOfTimeout?: boolean) =>
                    {
                        clearTimeout(timeoutId);
                        res.off("data", onData);
                        res.off("error", onError);
                        res.off("end", onEnd);

                        if (becauseOfTimeout)
                        {
                            // prevent crashing of "socket hang up" errors etc.
                            res.on("error", () => void 0);
                        }
                    }

                    const timeoutId = setTimeout(onTimeout, newTimeout);
                    res.on("data", onData);
                    res.on("error", onError);
                    res.on("end", onEnd);
                }
            }

            const startedAt = Date.now();
            const timeoutId = setTimeout(onTimeout, timeout);
            req.on("error", onError);
            req.on("close", onClose);
            req.on("connect", onConnect);

            req.end();
        })
    }
}