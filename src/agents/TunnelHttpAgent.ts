import * as http from "http";
import { IAgent } from "./IAgent";
import { Socket } from "net";
import { TunnelOptions, TunnelsFactory } from "../utils";
import { IRequestOptions, Proxy } from "../types";
import { AgentOptions } from "http";


export class TunnelHttpAgent extends http.Agent implements IAgent
{
    private readonly defaultPort = 80;
    private readonly defaultTimeout = 2 * 60 * 1000;

    constructor(private readonly config: TunnelOptions, options?: AgentOptions) { super(options) }

    public setProxy(proxy: Proxy | null): void
    {
        this.config.proxy = proxy;
    }

    public createConnection(options: IRequestOptions, cb: (a: Error | null, socket?: Socket) => void): void
    {
        const host = options.host || "localhost";
        const port = Number(options.port || this.defaultPort);
        TunnelsFactory.establishSocket({
            ...this.config,
            target: {
                host,
                port,
                serverName: options.servername
            }
        }, options.timeout || this.defaultTimeout)
            .then(socket => cb(null, socket))
            .catch(e => cb(e));
    }
}