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
            const source = Object.keys(this.prices).length > 0
                ? Object.keys(this.prices)
                        .filter((key) => key.endsWith("_EUR"))
                        .map((key) => ({
                            symbol: key.replace("_EUR", ""),
                            price: this.parsePrice(this.prices[key])
                        }))
                : this.fallbackCurrencies.map((symbol) => ({ symbol, price: 0 }));

            return source
                .filter((item) => this.fallbackCurrencies.includes(item.symbol))
                .sort((a, b) => a.symbol.localeCompare(b.symbol));
        },

        selectedPrice() {
            const tickerKey = `${this.selectedCurrency}_EUR`;
            return this.parsePrice(this.prices[tickerKey]);
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
                    const currentPrice = this.parsePrice(this.prices[`${wallet.symbol}_EUR`]);
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
        parsePrice(value) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : 0;
        },

        formatDateForApi(date) {
            const pad = (num) => String(num).padStart(2, "0");

            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        },

        loadPurchases() {
            axios
                .get("server/api/purchase")
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
                .post("server/api/purchase", payload)
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