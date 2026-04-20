window.WalletList = {
    emits: ["remove"],
    props: {
        wallets: {
            type: Array,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        totalPercent: {
            type: Number,
            required: true
        }
    },
    methods: {
        formatEUR(value) {
            return `${Number(value).toFixed(2)}\u20AC`;
        },
        formatPercent(value) {
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) {
                return "0.0%";
            }

            const prefix = numeric > 0 ? "+" : "";
            return `${prefix}${numeric.toFixed(1)}%`;
        }
    },
    template: /*html*/ `
        <div class="wallet-list">
            <h2>Wallets: {{ formatEUR(totalValue) }} ({{ formatPercent(totalPercent) }})</h2>

            <ul>
                <li v-for="wallet in wallets" :key="wallet.id">
                    <span class="wallet-row-text">
                        {{ wallet.name }}: {{ wallet.amount.toFixed(3) }} {{ wallet.symbol }} {{ formatEUR(wallet.value) }} ({{ formatPercent(wallet.percent) }})
                    </span>
                    <button class="button wallet-remove-button" @click="$emit('remove', wallet.id)">Entfernen</button>
                </li>
            </ul>
        </div>
    `
};
