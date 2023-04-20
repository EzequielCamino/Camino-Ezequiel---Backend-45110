const api = {
    post: async (url, body) => {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(response.redirected){
            window.location.replace(response.url);
        }
        if(response) {
            try {
                return await response.json();
            } catch (error) {
                return response
            }
        }
    },
    get: async (url) => {
        const response = await fetch(url, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        if(response) {
            return await response.json();
        }
    }
}
