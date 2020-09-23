import { Socket } from "net";
import { Proxy } from "../types";
import { RequestOptions as HttpRequestOptions } from "http";
import { RequestOptions as HttpsRequestOptions } from "https";


export interface IAgent
{
    setProxy(proxy: Proxy | null): void

    createConnection(
        options: HttpRequestOptions | HttpsRequestOptions,
        cb?: (a: Error | null, socket?: Socket) => void
    ): void
}