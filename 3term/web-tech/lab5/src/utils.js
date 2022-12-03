export function getDivisors(n) {
    let divisorsList = [];

    for (let i = 1; i <= n; i++) {
        if (n % i == 0) divisorsList.push(i);
    }

    return divisorsList;
}

export function setCookie(name, value, date = null) {
    let expiry = date;

    if (!date) {
        const today = new Date();
        expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000);
        expiry = expiry.toGMTString();
    }

    document.cookie = `${name}=${value}; path=/; expires=${expiry}`;
}

export function getCookie(name) {
    var v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return v ? v[2] : null;
}

export function deleteCookie(name) {
    setCookie(name, "", -1);
}
