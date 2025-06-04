class ApiClient {
    constructor(baseUrl = 'http://localhost:3030') {
        this.baseUrl = baseUrl;
    }

    async createTable() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tables`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating table:', error);
            throw error;
        }
    }

    async joinTable(tableId, player) {
        try {
            const response = await fetch(`${this.baseUrl}/api/tables/${tableId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(player)
            });
            return await response.json();
        } catch (error) {
            console.error('Error joining table:', error);
            throw error;
        }
    }

    async sendAction(tableId, action) {
        try {
            const response = await fetch(`${this.baseUrl}/api/tables/${tableId}/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(action)
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending action:', error);
            throw error;
        }
    }
}