import { IAgent } from "./IAgent";
import { RequestOptions } from "http";
import { Socket } from "net";


export interface IHttpAgent extends IAgent
{
    createConnection(options: RequestOptions, cb: (a: Error | null, socket?: Socket) => void): void
}