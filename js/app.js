// app.js — Main app logic: init modules, auto-refresh

(function () {
    'use strict';

    // Initialize all modules
    Gauge.init();
    Coins.init();
    VisitorCounter.init();
    SheetsWebhook.init();

    // Initial data fetch
    Gauge.fetchAndRender();
    Coins.fetchAndRender();

    // Auto-refresh Fear & Greed every 5 minutes
    setInterval(() => {
        Gauge.fetchAndRender();
    }, 5 * 60 * 1000);

    // Auto-refresh coin prices every 60 seconds
    setInterval(() => {
        Coins.fetchAndRender();
    }, 60 * 1000);
})();
