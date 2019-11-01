// TODO -- test this code
const getExpiration = (vEnd) => {
    if (!vEnd) return '';
    switch (vEnd.constructor) {
        case Number: return vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; max-age=${vEnd}`;
        /*
            Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
            version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
            the end parameter might not work as expected. A possible solution might be to convert the the
            relative time to an absolute time. For instance, replacing the previous line with:
        */
        /*
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
        */
        case String: return `; expires=${vEnd}`;
        case Date: return `; expires=${vEnd.toUTCString()}`;
        default: return '';
    }
};

export default {
    getItem(key) {
        if (!key) return null;
        return decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')) || null;
    },
    setItem(key, value, options = {}) {
        if (!key || (/^(?:expires|max\-age|path|domain|secure)$/i).test(key)) return false;

        const { path, domain, end, secure, samesite } = options;
        const expireStr = getExpiration(end);
        const domainStr = domain ? `; domain=${domain}` : '';
        const pathStr = path ? `; path=${path}` : '';
        const secureStr = secure ? '; secure' : '';
        const samesiteStr = samesite ? '; samesite' : '';

        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${expireStr}${domainStr}${pathStr}${secureStr}${samesiteStr}`;
        return true;
    },
    removeItem(key, options = {}) {
        if (!this.hasItem(key)) return false;
        const { path, domain } = options;
        const domainStr = domain ? `; domain=${domain}` : '';
        const pathStr = path ? `; path=${path}` : '';
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainStr}${pathStr}`;
        return true;
    },
    hasItem(key) {
        if (!key || (/^(?:expires|max\-age|path|domain|secure)$/i).test(key)) return false;

        return (new RegExp(`(?:^|;\\s*)${encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=`)).test(document.cookie);
    },
    clear() {
        const aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            this.removeItem(aKeys[nIdx]);
        }
        return aKeys;
    },
};