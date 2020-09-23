export type Address = {
    host: string
    port: number | string
}

export type Credentials = {
    login: string
    password: string
}

export type Proxy = Address & {
    auth?: Credentials | null
}