// --- DERIV WEBSOCKET API & ASSET MAPPING CONNECTOR ---
class DerivAPIConnector {
    constructor(appId) {
        this.appId = appId;
        this.ws = null;
        this.isConnected = false;
        this.subscribers = {};
    }

    connect() {
        return new Promise((resolve, reject) => {
            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`;
            this.ws = new WebSocket(endpoint);

            this.ws.onopen = () => {
                this.isConnected = true;
                console.log("[Deriv WebSocket] Connected successfully to institutional feeds.");
                resolve(true);
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.msg_type === 'tick' && data.tick) {
                    const symbol = data.tick.symbol;
                    if (this.subscribers[symbol]) {
                        this.subscribers[symbol](data.tick);
                    }
                }
            };

            this.ws.onerror = (error) => {
                console.error("[Deriv WebSocket] Error:", error);
                reject(error);
            };

            this.ws.onclose = () => {
                this.isConnected = false;
                console.warn("[Deriv WebSocket] Connection closed. Reconnecting...");
                setTimeout(() => this.connect(), 3000);
            };
        });
    }

    subscribeTicks(symbol, callback) {
        this.subscribers[symbol] = callback;
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify({ ticks: symbol }));
        }
    }

    sendContractPurchase(symbol, contractType, amount, duration = 12, durationUnit = 't') {
        if (!this.ws || !this.isConnected) return;
        const request = {
            proposal: 1,
            amount: amount,
            basis: 'stake',
            contract_type: contractType,
            currency: 'USD',
            duration: duration,
            duration_unit: durationUnit,
            symbol: symbol,
            passthrough: { partner_id: "34UGhpx0qrXHqpfKHAkGH", affiliate_token: "3A2CFHPG722B" }
        };
        this.ws.send(JSON.stringify(request));
        console.log(`[Contract Proposed] ${contractType} on ${symbol} for $${amount}`);
    }
}
