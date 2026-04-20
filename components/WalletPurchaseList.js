window.WalletPurchaseList = {
    props: {
        walletName: {
            type: String,
            required: true
        },
        walletSymbol: {
            type: String,
            required: true
        },
        purchases: {
            type: Array,
            required: true
        }
    },
    methods: {
        formatEUR(value) {
            return `${Number(value).toFixed(2)}\u20AC`;
        },
        formatAmount(value) {
            return Number(value).toFixed(4);
        },
        formatPercent(value) {
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) {
                return "0.0%";
            }

            const prefix = numeric > 0 ? "+" : "";
            return `${prefix}${numeric.toFixed(1)}%`;
        },
        gainClass(value) {
            const numeric = Number(value);
            if (!Number.isFinite(numeric) || numeric === 0) {
                return "wallet-purchase-neutral";
            }

            return numeric > 0 ? "wallet-purchase-profit" : "wallet-purchase-loss";
        }
    },
    template: /*html*/ `
        <div class="wallet-purchase-list">
            <h2>Wallet-Details: {{ walletName || "-" }} <span v-if="walletSymbol">({{ walletSymbol }})</span></h2>

            <p v-if="!walletName" class="wallet-empty-state">Bitte zuerst eine Wallet auswählen.</p>
            <p v-else-if="purchases.length === 0" class="wallet-empty-state">Keine Käufe für diese Wallet vorhanden.</p>

            <table v-else class="wallet-purchase-table">
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Menge</th>
                        <th>Kaufpreis</th>
                        <th>Invest</th>
                        <th>Aktuell</th>
                        <th>Wert jetzt</th>
                        <th>Gewinn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="purchase in purchases" :key="purchase.id">
                        <td>{{ purchase.date }}</td>
                        <td>{{ formatAmount(purchase.amount) }} {{ purchase.currency }}</td>
                        <td>{{ formatEUR(purchase.price) }}</td>
                        <td>{{ formatEUR(purchase.invested) }}</td>
                        <td>{{ formatEUR(purchase.currentPrice) }}</td>
                        <td>{{ formatEUR(purchase.currentValue) }}</td>
                        <td :class="gainClass(purchase.gainPercent)">
                            {{ formatEUR(purchase.gainValue) }} ({{ formatPercent(purchase.gainPercent) }})
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};
