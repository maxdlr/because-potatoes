'use strict';
class FetchManager {
    static postHeader = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    static baseUrl = 'http://localhost:8000'

    static async post(url = '', data = {}) {
        const config = {
            method: "post",
            headers: this.postHeader,
            body: JSON.stringify(data)
        };

        const response = await fetch(this.baseUrl + url, config);
        return response.json();
    }

    static async get(url = '') {
        const config = {
            method: "get",
            headers: this.postHeader,
        };

        const response =  await fetch(this.baseUrl + url, config);
        return await response.json();
    }
}

export default FetchManager;