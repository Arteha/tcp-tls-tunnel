import { normalizeHeaders } from "../src/utils";

console.log(JSON.stringify(normalizeHeaders({
    ACCEPT: "*/*",
    "Upgrade-insecure-Requests": "1",
    "accept-encoding": "gzip, deflate, br",
    "Extra-Header-1": "test",
    Cookie: "foo=bar",
    Host: "www.example.com",
    referer: "https://www.google.com/",
    "Extra-Header-2": "test",
    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "user-agent": "<USER_AGENT>",
    Connection: "keep-alive",
}), null, 2));

// Output:
// {
//     "Host": "www.example.com",
//     "Connection": "keep-alive",
//     "Upgrade-Insecure-Requests": "1",
//     "User-Agent": "<USER_AGENT>",
//     "Accept": "*/*",
//     "Referer": "https://www.google.com/",
//     "Accept-Encoding": "gzip, deflate, br",
//     "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
//     "Extra-Header-1": "test",
//     "Extra-Header-2": "test",
//     "Cookie": "foo=bar",
// }