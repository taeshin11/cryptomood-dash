// sheets.js — Google Sheets webhook POST on "Check Sentiment" button click

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
    },

    async sendData() {
        const gaugeValue = document.getElementById('gauge-value')?.textContent || '';
        const gaugeLabel = document.getElementById('gauge-label')?.textContent || '';

        const payload = {
            fearGreedValue: gaugeValue,
            fearGreedLabel: gaugeLabel,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            userAgent: navigator.userAgent,
            selectedCoins: '',
            referrer: document.referrer || 'direct'
        };

        this.statusEl.textContent = 'Sending...';
        this.button.disabled = true;

        if (this.WEBHOOK_URL === 'GOOGLE_SHEETS_WEBHOOK_URL') {
            this.statusEl.textContent = 'Sentiment checked! (Webhook not configured yet)';
            this.button.disabled = false;
            return;
        }

        try {
            await fetch(this.WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            this.statusEl.textContent = 'Sentiment data recorded!';
        } catch (err) {
            console.error('Sheets webhook error:', err);
            this.statusEl.textContent = 'Failed to send data.';
        }

        this.button.disabled = false;
        setTimeout(() => { this.statusEl.textContent = ''; }, 3000);
    }
};
