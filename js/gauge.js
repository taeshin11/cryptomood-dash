// gauge.js — Fear & Greed semicircular gauge renderer

const Gauge = {
    canvas: null,
    ctx: null,
    currentValue: 0,
    targetValue: 0,
    animationFrame: null,

    init() {
        this.canvas = document.getElementById('gauge-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.draw(0);
    },

    getColor(value) {
        if (value <= 20) return '#ea3943'; // Extreme Fear — red
        if (value <= 40) return '#ea8c00'; // Fear — orange
        if (value <= 60) return '#f5d100'; // Neutral — yellow
        if (value <= 80) return '#93d900'; // Greed — light green
        return '#16c784'; // Extreme Greed — green
    },

    getLabel(value) {
        if (value <= 20) return 'Extreme Fear';
        if (value <= 40) return 'Fear';
        if (value <= 60) return 'Neutral';
        if (value <= 80) return 'Greed';
        return 'Extreme Greed';
    },

    draw(value) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h - 10;
        const radius = Math.min(cx, cy) - 15;

        ctx.clearRect(0, 0, w, h);

        // Draw background arc segments
        const segments = [
            { start: 0, end: 0.2, color: '#ea3943' },
            { start: 0.2, end: 0.4, color: '#ea8c00' },
            { start: 0.4, end: 0.6, color: '#f5d100' },
            { start: 0.6, end: 0.8, color: '#93d900' },
            { start: 0.8, end: 1.0, color: '#16c784' }
        ];

        segments.forEach(seg => {
            const startAngle = Math.PI + (seg.start * Math.PI);
            const endAngle = Math.PI + (seg.end * Math.PI);
            ctx.beginPath();
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.lineWidth = 18;
            ctx.strokeStyle = seg.color + '33'; // 20% opacity
            ctx.lineCap = 'round';
            ctx.stroke();
        });

        // Draw filled arc up to current value
        const filledEnd = Math.PI + (value / 100) * Math.PI;
        const gradient = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
        gradient.addColorStop(0, '#ea3943');
        gradient.addColorStop(0.25, '#ea8c00');
        gradient.addColorStop(0.5, '#f5d100');
        gradient.addColorStop(0.75, '#93d900');
        gradient.addColorStop(1, '#16c784');

        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, filledEnd);
        ctx.lineWidth = 18;
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw needle
        const needleAngle = Math.PI + (value / 100) * Math.PI;
        const needleLen = radius - 25;
        const nx = cx + needleLen * Math.cos(needleAngle);
        const ny = cy + needleLen * Math.sin(needleAngle);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.getColor(value);
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw center dot
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#e0e0e0';
        ctx.fill();
    },

    animateTo(value) {
        this.targetValue = value;
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        const step = () => {
            const diff = this.targetValue - this.currentValue;
            if (Math.abs(diff) < 0.5) {
                this.currentValue = this.targetValue;
                this.draw(this.currentValue);
                return;
            }
            this.currentValue += diff * 0.08;
            this.draw(this.currentValue);
            this.animationFrame = requestAnimationFrame(step);
        };
        step();
    },

    async fetchAndRender() {
        try {
            const res = await fetch('https://api.alternative.me/fng/?limit=31&format=json');
            const json = await res.json();
            const data = json.data;

            if (!data || data.length === 0) throw new Error('No data');

            const current = data[0];
            const value = parseInt(current.value);

            // Update UI
            document.getElementById('gauge-value').textContent = value;
            document.getElementById('gauge-label').textContent = this.getLabel(value);
            document.getElementById('gauge-label').style.color = this.getColor(value);
            document.getElementById('gauge-value').style.color = this.getColor(value);

            const date = new Date(parseInt(current.timestamp) * 1000);
            document.getElementById('gauge-timestamp').textContent = 'Updated: ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            // Historical values
            if (data.length > 1) {
                const yesterday = data[1];
                document.getElementById('fng-yesterday').textContent = yesterday.value + ' — ' + this.getLabel(parseInt(yesterday.value));
                document.getElementById('fng-yesterday').style.color = this.getColor(parseInt(yesterday.value));
            }
            if (data.length > 7) {
                const week = data[7];
                document.getElementById('fng-week').textContent = week.value + ' — ' + this.getLabel(parseInt(week.value));
                document.getElementById('fng-week').style.color = this.getColor(parseInt(week.value));
            }
            if (data.length > 30) {
                const month = data[30];
                document.getElementById('fng-month').textContent = month.value + ' — ' + this.getLabel(parseInt(month.value));
                document.getElementById('fng-month').style.color = this.getColor(parseInt(month.value));
            }

            this.animateTo(value);
            return { value, label: current.value_classification };
        } catch (err) {
            console.error('Fear & Greed fetch error:', err);
            document.getElementById('gauge-label').textContent = 'Failed to load';
            return null;
        }
    }
};
