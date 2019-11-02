export default function callApi(
    url: string,
    method: string,
    body?: any,
) {
    return fetch(url, {
        method,
        headers: {
            "Content-type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined
    }).then(response => response.json());
}