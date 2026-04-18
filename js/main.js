const app = Vue.createApp({
    data() {
        return {
            walletsData: [],
            prices: {},
            selectedCurrency: "ADA",
            selectedWallet: "",
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

        walletOptions() {
            return this.walletsData.map((wallet) => {
                const currency = String(wallet.currency || "").toUpperCase();
                const currentPrice = this.getTickerPrice(currency);
                const amount = Number(wallet.amount || 0);
                const value = amount * currentPrice;
                return {
                    id: Number(wallet.id),
                    symbol: currency,
                    name: wallet.name || "",
                    currency: currency,
                    amount: amount,
                    value: value
                };
            }).filter((wallet) => wallet.currency);
        },

        wallets() {
            return this.walletOptions.map((wallet) => {
                const currentPrice = this.getTickerPrice(wallet.currency);
                const amount = Number(wallet.amount || 0);
                const value = amount * currentPrice;
                return {
                    symbol: wallet.currency,
                    amount: amount,
                    invested: 0,
                    value: value,
                    percent: 0,
                    name: wallet.name
                };
            });
        },

        totalWalletValue() {
            return this.wallets.reduce((sum, wallet) => sum + wallet.value, 0);
        },

        totalWalletPercent() {
            return 0;
        }
    },

    created() {
        this.loadPrices();
        this.loadWallets();
    },

    watch: {
        walletOptions: {
            immediate: true,
            handler(options) {
                if (!this.selectedWallet && Array.isArray(options) && options.length > 0) {
                    this.selectedWallet = options[0].currency;
                }
            }
        }
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

        loadWallets() {
            console.log("loadWallets() called");
            axios
                .get("/php/4_3_CryptoApp/server/api.php?r=wallet")
                .then((res) => {
                    console.log("Wallets loaded:", res.data);
                    this.walletsData = Array.isArray(res.data) ? res.data : [];
                    if (!this.selectedWallet && this.walletOptions.length > 0) {
                        this.selectedWallet = this.walletOptions[0].currency;
                    }
                })
                .catch((error) => {
                    console.error("Error loading wallets:", error);
                    this.walletsData = [];
                    this.selectedWallet = "";
                });
        },

        loadPrices() {
            console.log("loadPrices() called");
            axios
                .get("https://api.bitpanda.com/v1/ticker")
                .then((res) => {
                    console.log("Prices loaded:", res.data);
                    this.prices = res.data || {};
                })
                .catch((error) => {
                    console.error("Error loading prices:", error);
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

            axios.post("/php/4_3_CryptoApp/server/api.php?r=purchase", payload)
                .then(() => this.loadWallets())
                .catch((error) => console.error("Error buying currency:", error));
        },

        sellCurrency() {
            if (this.amount <= 0 || this.selectedPrice <= 0) {
                return;
            }

            const payload = {
                date: this.formatDateForApi(new Date()),
                amount: this.amount,
                price: this.selectedPrice,
                currency: this.selectedWallet || this.selectedCurrency
            };

            axios.post("/php/4_3_CryptoApp/server/api.php?r=purchase/sell", payload)
                .then(() => this.loadWallets())
                .catch((error) => console.error("Error selling currency:", error));
        }
    }
});

app.component("app-display", window.AppDisplay);
app.component("purchase-form", window.PurchaseForm);
app.component("wallet-list", window.WalletList);

app.mount("#app");
