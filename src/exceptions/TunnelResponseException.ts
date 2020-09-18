import { TunnelException } from "./TunnelException";

export class TunnelResponseException extends TunnelException
{
    constructor(public readonly status: number, message?: string)
    {
        super(`Tunnel responded with status: ${status}${message ? `. ${message}` : ""}`);
    }
}