// app.js — Main application orchestrator

document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n first (language detection + UI translation)
    if (typeof I18n !== 'undefined') I18n.init();

    // Initialize modules
    Gauge.init();
    Coins.init();
    VisitorCounter.init();
    SheetsWebhook.init();

    // Initialize feedback widget
    if (typeof FeedbackWidget !== 'undefined') FeedbackWidget.init();

    // Initial fetch
    Gauge.fetchAndRender();
    Coins.fetchAndRender();

    // Auto-refresh Fear & Greed every 5 minutes
    setInterval(() => Gauge.fetchAndRender(), 5 * 60 * 1000);

    // Auto-refresh coin prices every 60 seconds
    setInterval(() => Coins.fetchAndRender(), 60 * 1000);

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});
