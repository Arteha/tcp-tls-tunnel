import { Proxy } from "../types";


export interface IAgent
{
    setProxy(proxy: Proxy | null): void
}