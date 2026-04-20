window.WalletCreateForm = {
    props: {
        currencyOptions: {
            type: Array,
            required: true
        },
        newWalletName: {
            type: String,
            required: true
        },
        newWalletCurrency: {
            type: String,
            required: true
        }
    },
    emits: [
        "update:new-wallet-name",
        "update:new-wallet-currency",
        "create-wallet"
    ],
    template: /*html*/ `
        <div class="wallet-create-form">
            <h3>Neues Wallet erstellen</h3>
            <label for="wallet-name-input">Name:</label>
            <input
                id="wallet-name-input"
                type="text"
                :value="newWalletName"
                @input="$emit('update:new-wallet-name', $event.target.value)"
            />

            <label for="wallet-currency-select">Währung:</label>
            <select
                id="wallet-currency-select"
                :value="newWalletCurrency"
                @change="$emit('update:new-wallet-currency', $event.target.value)"
            >
                <option v-for="currency in currencyOptions" :key="'new-' + currency.symbol" :value="currency.symbol">
                    {{ currency.symbol }}
                </option>
            </select>

            <button class="button" @click="$emit('create-wallet', newWalletName, newWalletCurrency)">Wallet erstellen</button>
        </div>
    `
};
