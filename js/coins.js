// coins.js — Top coin prices fetcher & renderer

const Coins = {
    container: null,
    loadingEl: null,
    errorEl: null,

    init() {
        this.container = document.getElementById('coins-grid');
        this.loadingEl = document.getElementById('coins-loading');
        this.errorEl = document.getElementById('coins-error');
    },

    formatPrice(price) {
        if (price >= 1) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (price >= 0.01) return '$' + price.toFixed(4);
        return '$' + price.toFixed(6);
    },

    drawSparkline(canvas, prices, isPositive) {
        if (!canvas || !prices || prices.length === 0) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;

        ctx.beginPath();
        ctx.strokeStyle = isPositive ? '#00d4aa' : '#ff6b6b';
        ctx.lineWidth = 1.5;

        prices.forEach((price, i) => {
            const x = (i / (prices.length - 1)) * w;
            const y = h - ((price - min) / range) * (h - 4) - 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    },

    renderCoin(coin) {
        const change24h = coin.price_change_percentage_24h || 0;
        const isPositive = change24h >= 0;
        const changeClass = isPositive ? 'price-up' : 'price-down';
        const changeSign = isPositive ? '+' : '';

        const card = document.createElement('div');
        card.className = 'coin-card bg-card rounded-xl p-4 shadow-md shadow-black/10';
        card.innerHTML = `
            <div class="flex items-center gap-3 mb-3">
                <img src="${coin.image}" alt="${coin.name} icon" width="32" height="32" class="rounded-full" loading="lazy">
                <div class="min-w-0">
                    <p class="font-semibold text-sm truncate">${coin.name}</p>
                    <p class="text-textSecondary text-xs uppercase">${coin.symbol}</p>
                </div>
            </div>
            <p class="text-lg font-bold">${this.formatPrice(coin.current_price)}</p>
            <p class="${changeClass} text-sm font-medium">${changeSign}${change24h.toFixed(2)}%</p>
            <canvas class="sparkline-canvas mt-2" width="120" height="32" aria-label="${coin.name} 7-day price chart"></canvas>
        `;

        this.container.appendChild(card);

        // Draw sparkline
        const sparklineCanvas = card.querySelector('.sparkline-canvas');
        if (coin.sparkline_in_7d && coin.sparkline_in_7d.price) {
            this.drawSparkline(sparklineCanvas, coin.sparkline_in_7d.price, isPositive);
        }
    },

    async fetchAndRender() {
        try {
            this.loadingEl.classList.remove('hidden');
            this.errorEl.classList.add('hidden');
            this.container.innerHTML = '';

            const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d');

            if (!res.ok) {
                if (res.status === 429) throw new Error('Rate limited — please wait a moment');
                throw new Error('API error: ' + res.status);
            }

            const coins = await res.json();
            this.loadingEl.classList.add('hidden');

            coins.forEach(coin => this.renderCoin(coin));
            return coins;
        } catch (err) {
            console.error('CoinGecko fetch error:', err);
            this.loadingEl.classList.add('hidden');
            this.errorEl.textContent = 'Failed to load coin data. ' + err.message;
            this.errorEl.classList.remove('hidden');
            return null;
        }
    }
};
