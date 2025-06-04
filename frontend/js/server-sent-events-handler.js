class ServerSentEventsHandler {
    constructor(baseUrl = 'http://localhost:3030') {
        this.baseUrl = baseUrl;
        this.eventSource = null;
        this.connected = false;
        this.tableId = null;
        this.eventCallbacks = {};
    }

    connect(tableId) {
        if (this.eventSource) {
            this.disconnect();
        }

        this.tableId = tableId;
        this.eventSource = new EventSource(`${this.baseUrl}/events/${tableId}`);

        this.eventSource.onopen = () => {
            this.connected = true;
            this.updateConnectionStatus(true);
            this.emit('connected');
        };

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.emit('message', data);
            } catch (error) {
                this.emit('message', event.data);
            }
        };

        this.eventSource.onerror = (error) => {
            console.error('Server-Sent Events error:', error);
            this.connected = false;
            this.updateConnectionStatus(false);
            this.emit('error', error);
        };

        this.eventSource.onclose = () => {
            this.connected = false;
            this.updateConnectionStatus(false);
            this.emit('disconnected');
        };
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        this.connected = false;
        this.updateConnectionStatus(false);
    }

    on(event, callback) {
        if (!this.eventCallbacks[event]) {
            this.eventCallbacks[event] = [];
        }
        this.eventCallbacks[event].push(callback);
    }

    off(event, callback) {
        if (this.eventCallbacks[event]) {
            this.eventCallbacks[event] = this.eventCallbacks[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.eventCallbacks[event]) {
            this.eventCallbacks[event].forEach(callback => callback(data));
        }
    }

    updateConnectionStatus(connected) {
        const statusEl = document.getElementById('connection-status');
        if (statusEl) {
            statusEl.textContent = connected ? 'Connected' : 'Disconnected';
            statusEl.className = connected ? 'connected' : '';
        }
    }
}