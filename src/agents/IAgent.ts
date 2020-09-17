import { Socket } from "net";
import { IRequestOptions, Proxy } from "../types";


export interface IAgent
{
    setProxy(proxy: Proxy | null): void

    createConnection(options: IRequestOptions, cb?: (a: Error | null, socket?: Socket) => void): void
}