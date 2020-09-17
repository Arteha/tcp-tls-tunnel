import { Socket } from "net";
import * as http from "http";
import { Address, Credentials, Proxy } from "../types";
import { TunnelException } from "../exceptions";


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
                Secure: options.secure ? "1" : undefined,
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

            let timeoutId: any;

            const on = () =>
            {
                timeoutId = setTimeout(onTimeout, timeout);
                req.on("error", onError);
                req.on("close", onClose);
                req.on("connect", onConnect);
            }

            const off = () =>
            {
                clearTimeout(timeoutId);
                req.off("error", onError);
                req.off("close", onClose);
                req.off("connect", onConnect);
            }

            const onTimeout = () =>
            {
                off();
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

            const onConnect = () =>
            {
                off();
                resolve(req.socket);
            }

            on();
            req.end();
        })
    }
}