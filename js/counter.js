// counter.js — Visitor counter using localStorage fallback
// Uses Google Sheets webhook if configured, otherwise localStorage-based counter

const VisitorCounter = {
    SHEETS_URL: 'GOOGLE_SHEETS_WEBHOOK_URL', // Replace after deploying Apps Script

    init() {
        this.trackVisit();
    },

    trackVisit() {
        // localStorage-based fallback counter
        const today = new Date().toISOString().split('T')[0];
        const stored = JSON.parse(localStorage.getItem('cryptomood_visits') || '{}');

        if (!stored.total) stored.total = 0;
        if (!stored.days) stored.days = {};

        // Only count once per session
        if (!sessionStorage.getItem('cryptomood_counted')) {
            stored.total++;
            stored.days[today] = (stored.days[today] || 0) + 1;
            localStorage.setItem('cryptomood_visits', JSON.stringify(stored));
            sessionStorage.setItem('cryptomood_counted', '1');
        }

        const todayCount = stored.days[today] || 0;
        document.getElementById('visitors-today').textContent = todayCount;
        document.getElementById('visitors-total').textContent = stored.total;

        // Try Google Sheets if configured
        if (this.SHEETS_URL !== 'GOOGLE_SHEETS_WEBHOOK_URL') {
            this.fetchFromSheets();
        }
    },

    async fetchFromSheets() {
        try {
            const res = await fetch(this.SHEETS_URL);
            const data = await res.json();
            if (data.today !== undefined) {
                document.getElementById('visitors-today').textContent = data.today;
            }
            if (data.total !== undefined) {
                document.getElementById('visitors-total').textContent = data.total;
            }
        } catch (err) {
            // Silently fall back to localStorage counts
        }
    }
};
