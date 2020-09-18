import { RequestOptions } from "http";

export type Address = {
    host: string
    port: number | string
}

export type Credentials = {
    login: string
    password: string
}

export type Proxy = Address & {
    auth?: Credentials
}

export interface IRequestOptions extends RequestOptions
{
    servername?: string
}