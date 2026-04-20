const app = Vue.createApp({
    data() {
        return {
            walletsData: [],
            walletPurchasesData: [],
            prices: {},
            selectedCurrency: "ADA",
            selectedWallet: null,
            amount: 0.02,
            fallbackCurrencies: ["BTC", "ETH", "XRP", "SOL", "ADA", "DOGE", "BNB"],
            newWalletName: "",
            newWalletCurrency: "ADA",
            formMessage: ""
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
            return this.walletsData.map((wallet) => ({
                id: Number(wallet.id),
                name: String(wallet.name || "").trim(),
                currency: String(wallet.currency || "").toUpperCase()
            })).filter((wallet) => wallet.id > 0 && wallet.currency);
        },

        wallets() {
            return this.walletsData.map((wallet) => {
                const symbol = String(wallet.currency || "").toUpperCase();
                const amount = Number(wallet.amount || 0);
                const invested = Number(wallet.price || 0);
                const currentPrice = this.getTickerPrice(symbol);
                const value = amount * currentPrice;
                const percent = invested > 0 ? ((value - invested) / invested) * 100 : 0;

                return {
                    id: Number(wallet.id),
                    symbol,
                    name: wallet.name,
                    amount,
                    invested,
                    value,
                    percent
                };
            });
        },

        totalWalletValue() {
            return this.wallets.reduce((sum, wallet) => sum + wallet.value, 0);
        },

        totalWalletPercent() {
            return 0;
        },

        selectedWalletCurrency() {
            const selected = this.walletOptions.find((wallet) => wallet.id === Number(this.selectedWallet));
            return selected ? selected.currency : "";
        },

        selectedWalletName() {
            const selected = this.walletOptions.find((wallet) => wallet.id === Number(this.selectedWallet));
            return selected ? selected.name : "";
        },

        selectedWalletPurchases() {
            return this.walletPurchasesData.map((purchase) => {
                const amount = Number(purchase.amount || 0);
                const price = Number(purchase.price || 0);
                const currency = String(purchase.currency || "").toUpperCase();
                const currentPrice = this.getTickerPrice(currency);
                const invested = amount * price;
                const currentValue = amount * currentPrice;
                const gainValue = currentValue - invested;
                const gainPercent = invested !== 0 ? (gainValue / Math.abs(invested)) * 100 : 0;

                return {
                    id: Number(purchase.id),
                    date: String(purchase.date || ""),
                    currency,
                    amount,
                    price,
                    invested,
                    currentPrice,
                    currentValue,
                    gainValue,
                    gainPercent
                };
            });
        },

        canSell() {
            if (!this.selectedWalletCurrency || !this.selectedCurrency) {
                return false;
            }
            return this.selectedWalletCurrency === String(this.selectedCurrency).toUpperCase();
        }
    },

    created() {
        this.loadPrices();
        this.loadWallets();
        this.syncNewWalletCurrency();
    },

    watch: {
        currencyOptions: {
            immediate: true,
            handler(options) {
                if (!Array.isArray(options) || options.length === 0) {
                    return;
                }

                const availableSymbols = options.map((option) => option.symbol);
                if (!availableSymbols.includes(String(this.newWalletCurrency).toUpperCase())) {
                    this.newWalletCurrency = availableSymbols[0];
                }
            }
        },
        walletOptions: {
            immediate: true,
            handler(options) {
                const selectedExists = options.some((wallet) => wallet.id === Number(this.selectedWallet));
                if (!selectedExists) {
                    this.selectedWallet = options.length > 0 ? options[0].id : null;
                }
            }
        },
        selectedWallet: {
            immediate: true,
            handler() {
                this.loadWalletPurchases();
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

        syncNewWalletCurrency() {
            const firstCurrency = this.currencyOptions[0]?.symbol;
            if (firstCurrency) {
                this.newWalletCurrency = firstCurrency;
            }
        },

        loadWallets() {
            axios
                .get("/php/4_3_CryptoApp/server/api.php?r=wallet")
                .then((res) => {
                    this.walletsData = Array.isArray(res.data) ? res.data : [];
                    const selectedExists = this.walletOptions.some((wallet) => wallet.id === Number(this.selectedWallet));
                    if (!selectedExists) {
                        this.selectedWallet = this.walletOptions.length > 0 ? this.walletOptions[0].id : null;
                    }
                })
                .catch((error) => {
                    console.error("Error loading wallets:", error);
                    this.walletsData = [];
                    this.selectedWallet = null;
                });
        },

        loadWalletPurchases() {
            const walletId = Number(this.selectedWallet);

            if (!Number.isFinite(walletId) || walletId <= 0) {
                this.walletPurchasesData = [];
                return;
            }

            axios
                .get(`/php/4_3_CryptoApp/server/api.php?r=wallet/purchase/${walletId}`)
                .then((res) => {
                    this.walletPurchasesData = Array.isArray(res.data) ? res.data : [];
                })
                .catch((error) => {
                    console.error("Error loading wallet purchases:", error);
                    this.walletPurchasesData = [];
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
            if (!this.selectedWalletCurrency || !this.selectedWallet) {
                this.formMessage = "Bitte zuerst eine Wallet waehlen.";
                return;
            }

            if (String(this.selectedWalletCurrency).toUpperCase() !== String(this.selectedCurrency).toUpperCase()) {
                this.formMessage = "Wallet und Kryptowährung müssen übereinstimmen.";
                return;
            }

            if (this.amount <= 0 || this.selectedPrice <= 0) {
                this.formMessage = "Ungueltige Kaufdaten.";
                return;
            }

            const payload = {
                date: this.formatDateForApi(new Date()),
                amount: this.amount,
                price: this.selectedPrice,
                currency: this.selectedCurrency,
                wallet_id: Number(this.selectedWallet)
            };

            axios.post("/php/4_3_CryptoApp/server/api.php?r=purchase", payload)
                .then(() => {
                    this.formMessage = "Kauf gespeichert.";
                    this.loadWallets();
                    this.loadWalletPurchases();
                })
                .catch((error) => {
                    this.formMessage = "Fehler beim Kaufen.";
                    console.error("Error buying currency:", error);
                });
        },

        sellCurrency() {
            if (!this.canSell) {
                this.formMessage = "Verkauf nur möglich, wenn Wallet und Kryptowährung identisch sind.";
                return;
            }

            if (this.amount <= 0 || this.selectedPrice <= 0) {
                this.formMessage = "Ungueltige Verkaufsdaten.";
                return;
            }

            const payload = {
                date: this.formatDateForApi(new Date()),
                amount: this.amount,
                price: this.selectedPrice,
                currency: this.selectedWalletCurrency,
                wallet_id: Number(this.selectedWallet)
            };

            axios.post("/php/4_3_CryptoApp/server/api.php?r=purchase/sell", payload)
                .then(() => {
                    this.formMessage = "Verkauf gespeichert.";
                    this.loadWallets();
                    this.loadWalletPurchases();
                })
                .catch((error) => {
                    this.formMessage = "Fehler beim Verkaufen.";
                    console.error("Error selling currency:", error);
                });
        },

        createWallet(nameInput = this.newWalletName, currencyInput = this.newWalletCurrency) {
            const name = String(nameInput || "").trim();
            const currency = String(currencyInput || "").toUpperCase();

            if (!name || !currency) {
                this.formMessage = "Wallet-Name und Waehrung sind erforderlich.";
                return;
            }

            axios.post("/php/4_3_CryptoApp/server/api.php?r=wallet", { name, currency })
                .then(() => {
                    this.formMessage = "Wallet erstellt.";
                    this.newWalletName = "";
                    this.newWalletCurrency = currency;
                    return axios.get("/php/4_3_CryptoApp/server/api.php?r=wallet");
                })
                .then((res) => {
                    this.walletsData = Array.isArray(res.data) ? res.data : [];
                    const created = this.walletOptions.find((wallet) => wallet.name.toLowerCase() === name.toLowerCase() && wallet.currency === currency);
                    if (created) {
                        this.selectedWallet = created.id;
                    }
                })
                .catch((error) => {
                    this.formMessage = "Fehler beim Erstellen der Wallet.";
                    console.error("Error creating wallet:", error);
                });
        },

        removeWallet(walletId) {
            const id = Number(walletId);
            if (!Number.isFinite(id) || id <= 0) {
                this.formMessage = "Ungueltige Wallet-ID.";
                return;
            }

            axios.delete(`/php/4_3_CryptoApp/server/api.php?r=wallet/${id}`)
                .then(() => {
                    this.formMessage = "Wallet entfernt.";
                    return axios.get("/php/4_3_CryptoApp/server/api.php?r=wallet");
                })
                .then((res) => {
                    this.walletsData = Array.isArray(res.data) ? res.data : [];
                    const selectedExists = this.walletOptions.some((wallet) => wallet.id === Number(this.selectedWallet));
                    if (!selectedExists) {
                        this.selectedWallet = this.walletOptions.length > 0 ? this.walletOptions[0].id : null;
                    }
                    this.loadWalletPurchases();
                })
                .catch((error) => {
                    this.formMessage = "Fehler beim Entfernen der Wallet.";
                    console.error("Error removing wallet:", error);
                });
        }
    }
});

app.component("app-display", window.AppDisplay);
app.component("purchase-form", window.PurchaseForm);
app.component("wallet-list", window.WalletList);
app.component("wallet-purchase-list", window.WalletPurchaseList);

app.mount("#app");
