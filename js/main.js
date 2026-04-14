const app = Vue.createApp({
    data() {
        return {
            purchases: [],
            prices: {},
            selectedCurrency: "BTC",
            amount: 0.02,
            fallbackCurrencies: ["BTC", "ETH", "XRP", "SOL", "ADA", "DOGE", "BNB"]
        };
    },

    computed: {
        currencyOptions() {
            return this.fallbackCurrencies.map((symbol) => ({
                symbol,
                price: this.getTickerPrice(symbol)
            })).sort((a, b) => a.symbol.localeCompare(b.symbol));
        },

        selectedPrice() {
            return this.getTickerPrice(this.selectedCurrency);
        },

        currentValue() {
            return this.amount * this.selectedPrice;
        },

        wallets() {
            const grouped = {};

            this.purchases.forEach((purchase) => {
                if (!grouped[purchase.currency]) {
                    grouped[purchase.currency] = {
                        symbol: purchase.currency,
                        amount: 0,
                        invested: 0
                    };
                }

                grouped[purchase.currency].amount += Number(purchase.amount);
                grouped[purchase.currency].invested += Number(purchase.amount) * Number(purchase.price);
            });

            return Object.values(grouped)
                .map((wallet) => {
                    const currentPrice = this.getTickerPrice(wallet.symbol);
                    const value = wallet.amount * currentPrice;
                    const percent = wallet.invested > 0 ? ((value - wallet.invested) / wallet.invested) * 100 : 0;

                    return {
                        symbol: wallet.symbol,
                        amount: wallet.amount,
                        invested: wallet.invested,
                        value,
                        percent
                    };
                })
                .sort((a, b) => b.value - a.value);
        },

        totalWalletValue() {
            return this.wallets.reduce((sum, wallet) => sum + wallet.value, 0);
        },

        totalInvested() {
            return this.wallets.reduce((sum, wallet) => sum + wallet.invested, 0);
        },

        totalWalletPercent() {
            if (this.totalInvested <= 0) {
                return 0;
            }

            return ((this.totalWalletValue - this.totalInvested) / this.totalInvested) * 100;
        }
    },

    created() {
        this.loadPurchases();
        this.loadPrices();
    },

    methods: {
        getTickerPrice(symbol) {
            const upperSymbol = String(symbol).toUpperCase();
            const lowerSymbol = String(symbol).toLowerCase();
            const upperKey = `${upperSymbol}_EUR`;
            const lowerKey = `${lowerSymbol}_eur`;

            const direct = this.prices[upperSymbol] ?? this.prices[lowerSymbol] ?? this.prices[upperKey] ?? this.prices[lowerKey];

            if (direct && typeof direct === "object" && direct.EUR !== undefined) {
                return this.parsePrice(direct.EUR);
            }

            return this.parsePrice(direct);
        },

        parsePrice(value) {
            const normalized = typeof value === "string" ? value.replace(",", ".") : value;
            const parsed = Number(normalized);
            return Number.isFinite(parsed) ? parsed : 0;
        },

        formatDateForApi(date) {
            const pad = (num) => String(num).padStart(2, "0");

            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        },

        loadPurchases() {
            axios
                .get("server/api.php?r=purchase")
                .then((res) => {
                    this.purchases = Array.isArray(res.data) ? res.data : [];
                })
                .catch(() => {
                    this.purchases = [];
                });
        },

        loadPrices() {
            axios
                .get("https://api.bitpanda.com/v1/ticker")
                .then((res) => {
                    this.prices = res.data || {};
                })
                .catch(() => {
                    this.prices = {};
                });
        },

        buyCurrency() {
            if (this.amount <= 0 || this.selectedPrice <= 0) {
                return;
            }

            const payload = {
                date: this.formatDateForApi(new Date()),
                amount: this.amount,
                price: this.selectedPrice,
                currency: this.selectedCurrency
            };

            axios
                .post("server/api.php?r=purchase", payload)
                .then(() => {
                    this.loadPurchases();
                })
                .catch(() => {
                    // Fehler bewusst still halten, UI bleibt bedienbar.
                });
        }
    }
});

app.component("app-display", window.AppDisplay);
app.component("purchase-form", window.PurchaseForm);
app.component("wallet-list", window.WalletList);

app.mount("#app");
