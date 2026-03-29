// sheets.js — Check Sentiment button: saves locally + optionally POSTs to Google Sheets

const SheetsWebhook = {
    WEBHOOK_URL: 'GOOGLE_SHEETS_WEBHOOK_URL', // Replace after deploying Apps Script
    button: null,
    statusEl: null,

    init() {
        this.button = document.getElementById('check-sentiment-btn');
        this.statusEl = document.getElementById('sheets-status');
        if (this.button) {
            this.button.addEventListener('click', () => this.sendData());
        }
        this.renderHistory();
    },

    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('cryptomood_sentiment_log') || '[]');
        } catch { return []; }
    },

    saveToHistory(entry) {
        var history = this.getHistory();
        history.unshift(entry);
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem('cryptomood_sentiment_log', JSON.stringify(history));
    },

    renderHistory() {
        var container = document.getElementById('sentiment-history');
        if (!container) return;
        var history = this.getHistory();
        if (history.length === 0) {
            container.innerHTML = '';
            return;
        }
        var items = history.slice(0, 5).map(function(entry) {
            var d = new Date(entry.timestamp);
            var dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return '<div class="flex justify-between items-center text-xs py-1.5 border-b border-gray-800 last:border-0">' +
                '<span class="text-textSecondary">' + dateStr + '</span>' +
                '<span style="color:' + entry.color + '" class="font-medium">' + entry.value + ' — ' + entry.label + '</span>' +
                '</div>';
        }).join('');
        container.innerHTML = '<p class="text-xs text-textSecondary mb-2">Recent checks:</p>' + items;
    },

    getColor(value) {
        var v = parseInt(value);
        if (v <= 20) return '#ea3943';
        if (v <= 40) return '#ea8c00';
        if (v <= 60) return '#f5d100';
        if (v <= 80) return '#93d900';
        return '#16c784';
    },

    async sendData() {
        var gaugeValue = document.getElementById('gauge-value')?.textContent || '';
        var gaugeLabel = document.getElementById('gauge-label')?.textContent || '';

        if (gaugeValue === '--' || gaugeValue === '' || gaugeLabel === 'Loading...') {
            this.statusEl.textContent = 'Waiting for data to load...';
            setTimeout(() => { this.statusEl.textContent = ''; }, 2000);
            return;
        }

        var payload = {
            fearGreedValue: gaugeValue,
            fearGreedLabel: gaugeLabel,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            userAgent: navigator.userAgent,
            selectedCoins: '',
            referrer: document.referrer || 'direct'
        };

        this.button.disabled = true;

        // Save to local history
        this.saveToHistory({
            value: gaugeValue,
            label: gaugeLabel,
            color: this.getColor(gaugeValue),
            timestamp: new Date().toISOString()
        });

        this.statusEl.innerHTML = 'Market sentiment: <strong style="color:' + this.getColor(gaugeValue) + '">' + gaugeValue + ' — ' + gaugeLabel + '</strong>';
        this.renderHistory();

        // Also POST to Google Sheets if configured
        if (this.WEBHOOK_URL !== 'GOOGLE_SHEETS_WEBHOOK_URL') {
            try {
                await fetch(this.WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.error('Sheets webhook error:', err);
            }
        }

        this.button.disabled = false;
        setTimeout(() => { this.statusEl.textContent = ''; }, 5000);
    }
};
