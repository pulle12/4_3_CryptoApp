const app = Vue.createApp({
    data() {
        return {
            purchases: [],
            wallets: [],
            prices: {}
        }
    },

    created() {
        this.loadPurchases();
        this.loadWallets();
        this.loadPrices();
    },

    methods: {
        loadPurchases() {
            axios.get("http://localhost/php43_angabe/server/api/purchase")
                .then(res => {
                    this.purchases = res.data;
                })
                .catch(err => console.log(err));
        },

        loadWallets() {
            axios.get("http://localhost/php43_angabe/server/api/wallet")
                .then(res => {
                    this.wallets = res.data;
                })
                .catch(err => console.log(err));
        },

        loadPrices() {
            axios.get("https://api.bitpanda.com/v1/ticker")
                .then(res => {
                    this.prices = res.data;
                })
                .catch(err => console.log(err));
        },

        addPurchase(purchase) {
            this.purchases.unshift(purchase);
        }
    }
});

// Komponenten registrieren
app.component('app-display', window.AppDisplay);
app.component('purchase-form', window.PurchaseForm);
app.component('wallet-list', window.WalletList);

// Mount
app.mount('#app');