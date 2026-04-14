window.WalletList = {
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
            return `${Number(value).toFixed(1)}%`;
        }
    },
    template: /*html*/ `
        <div class="wallet-list">
            <h2>Wallets: {{ formatEUR(totalValue) }} ({{ formatPercent(totalPercent) }})</h2>

            <ul>
                <li v-for="wallet in wallets" :key="wallet.symbol">
                    {{ wallet.amount.toFixed(3) }} {{ wallet.symbol }} {{ formatEUR(wallet.value) }} ({{ formatPercent(wallet.percent) }})
                </li>
            </ul>
        </div>
    `
};
