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
    }).then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]).then(response => ({
            statusCode: response[0],
            data: response[1],
        }));
    });
}