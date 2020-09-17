export type Headers = Record<string, any>;

let pos = 1;
const ORDER: Record<string, number> = {
    Host: pos++,
    Connection: pos++,
    Pragma: pos++,
    "Cache-Control": pos++,
    "Upgrade-Insecure-Requests": pos++,
    "User-Agent": pos++,
    "Accept": pos++,
    "Referer": pos++,
    "Accept-Encoding": pos++,
    "Accept-Language": pos++
}
const HEADERS_VALID_NAMES: Record<string, string> = Object
    .keys(ORDER)
    .reduce<Record<string, string>>((memo, key) =>
    {
        memo[key.toLowerCase()] = key;
        return memo;
    }, {});

export function normalizeHeaders({...headers}: Headers): Record<string, any>
{
    const detectedHeaders: Headers = {};
    let Cookie: any = null;
    for (const key in headers)
    {
        if (headers.hasOwnProperty(key))
        {
            const lowerKey = key.toLowerCase();
            const h = HEADERS_VALID_NAMES[lowerKey];
            if (h)
            {
                detectedHeaders[h] = headers[key];
                delete headers[key];
            }
            else if (lowerKey == "cookie")
            {
                Cookie = headers[key];
                delete headers[key];
            }
        }
    }

    const resultHeaders: Record<string, any> = {
        ...Object
            .keys(detectedHeaders)
            .sort((a, b) => ORDER[a] > ORDER[b] ? 1 : -1)
            .reduce<Record<string, any>>((memo, key) =>
            {
                memo[key] = detectedHeaders[key];
                return memo;
            }, {}),
        ...headers,
        ...(Cookie != null ? {Cookie} : {})
    };

    return resultHeaders;
}