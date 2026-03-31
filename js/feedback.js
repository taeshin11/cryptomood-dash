// feedback.js — Non-intrusive floating feedback widget
// Opens a modal that composes a mailto: link to taeshinkim11@gmail.com

const FeedbackWidget = {
    isOpen: false,

    init() {
        this.createButton();
        this.createModal();
    },

    createButton() {
        var btn = document.createElement('button');
        btn.id = 'feedback-fab';
        btn.setAttribute('aria-label', I18n.t('feedback.title'));
        btn.setAttribute('title', I18n.t('feedback.title'));
        btn.className = 'fixed bottom-5 right-5 z-50 w-12 h-12 bg-accent/20 hover:bg-accent/30 border border-accent/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-black/30 group';
        btn.innerHTML = '<svg class="w-5 h-5 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>';
        btn.addEventListener('click', () => this.toggleModal());
        document.body.appendChild(btn);
    },

    createModal() {
        var overlay = document.createElement('div');
        overlay.id = 'feedback-overlay';
        overlay.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm hidden flex items-center justify-center p-4';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });

        var modal = document.createElement('div');
        modal.id = 'feedback-modal';
        modal.className = 'bg-card border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-xl shadow-black/40 transform transition-transform';

        modal.innerHTML = `
            <h3 id="feedback-modal-title" class="text-lg font-semibold text-accent mb-4" data-i18n="feedback.title">${I18n.t('feedback.title')}</h3>
            <form id="feedback-form" class="space-y-4">
                <div>
                    <label class="block text-xs text-textSecondary mb-1" data-i18n="feedback.name">${I18n.t('feedback.name')}</label>
                    <input type="text" id="fb-name" class="w-full bg-bg border border-gray-700 rounded-lg px-3 py-2 text-sm text-textPrimary focus:border-accent focus:outline-none" data-i18n="feedback.name">
                </div>
                <div>
                    <label class="block text-xs text-textSecondary mb-1" data-i18n="feedback.type">${I18n.t('feedback.type')}</label>
                    <select id="fb-type" class="w-full bg-bg border border-gray-700 rounded-lg px-3 py-2 text-sm text-textPrimary focus:border-accent focus:outline-none">
                        <option value="Feature Request" data-i18n-val="feedback.type.feature">${I18n.t('feedback.type.feature')}</option>
                        <option value="Bug Report" data-i18n-val="feedback.type.bug">${I18n.t('feedback.type.bug')}</option>
                        <option value="Improvement" data-i18n-val="feedback.type.improvement">${I18n.t('feedback.type.improvement')}</option>
                        <option value="Other" data-i18n-val="feedback.type.other">${I18n.t('feedback.type.other')}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs text-textSecondary mb-1" data-i18n="feedback.message">${I18n.t('feedback.message')}</label>
                    <textarea id="fb-message" rows="4" class="w-full bg-bg border border-gray-700 rounded-lg px-3 py-2 text-sm text-textPrimary focus:border-accent focus:outline-none resize-none" placeholder="${I18n.t('feedback.messagePlaceholder')}" data-i18n="feedback.messagePlaceholder" required></textarea>
                </div>
                <div class="flex gap-3 pt-2">
                    <button type="submit" class="flex-1 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/40 px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span data-i18n="feedback.send">${I18n.t('feedback.send')}</span>
                    </button>
                    <button type="button" id="feedback-cancel" class="px-4 py-2.5 text-textSecondary hover:text-textPrimary transition-colors text-sm rounded-xl border border-gray-700 hover:border-gray-600">
                        <span data-i18n="feedback.cancel">${I18n.t('feedback.cancel')}</span>
                    </button>
                </div>
            </form>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Form submit
        document.getElementById('feedback-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendFeedback();
        });

        document.getElementById('feedback-cancel').addEventListener('click', () => this.closeModal());

        // ESC key close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.closeModal();
        });
    },

    toggleModal() {
        if (this.isOpen) this.closeModal();
        else this.openModal();
    },

    openModal() {
        document.getElementById('feedback-overlay').classList.remove('hidden');
        document.getElementById('feedback-overlay').classList.add('flex');
        this.isOpen = true;
        document.getElementById('fb-message').focus();
    },

    closeModal() {
        document.getElementById('feedback-overlay').classList.add('hidden');
        document.getElementById('feedback-overlay').classList.remove('flex');
        this.isOpen = false;
    },

    sendFeedback() {
        var name = document.getElementById('fb-name').value.trim();
        var type = document.getElementById('fb-type').value;
        var message = document.getElementById('fb-message').value.trim();

        if (!message) return;

        var subject = encodeURIComponent('[CryptoMood Dash] ' + type + (name ? ' from ' + name : ''));
        var body = encodeURIComponent(
            'Feedback Type: ' + type + '\n' +
            (name ? 'Name: ' + name + '\n' : '') +
            'Language: ' + I18n.currentLang + '\n' +
            'Page: ' + window.location.href + '\n' +
            'Screen: ' + window.innerWidth + 'x' + window.innerHeight + '\n' +
            'Date: ' + new Date().toISOString() + '\n\n' +
            '--- Message ---\n\n' +
            message
        );

        window.location.href = 'mailto:taeshinkim11@gmail.com?subject=' + subject + '&body=' + body;

        // Close after a brief delay
        setTimeout(() => {
            this.closeModal();
            document.getElementById('fb-message').value = '';
            document.getElementById('fb-name').value = '';
        }, 500);
    }
};
