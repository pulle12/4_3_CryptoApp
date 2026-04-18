window.PurchaseForm = {
    props: {
        currencyOptions: {
            type: Array,
            required: true
        },
        selectedCurrency: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currentValue: {
            type: Number,
            required: true
        },
        walletOptions: {
            type: Array,
            required: true
        },
        selectedWallet: {
            type: [Number, String, null],
            required: false,
            default: null
        },
        newWalletName: {
            type: String,
            required: true
        },
        newWalletCurrency: {
            type: String,
            required: true
        },
        canSell: {
            type: Boolean,
            required: true
        },
        formMessage: {
            type: String,
            required: true
        }
    },
    emits: [
        "update:selected-currency",
        "update:amount",
        "buy",
        "sell",
        "update:selected-wallet",
        "update:new-wallet-name",
        "update:new-wallet-currency",
        "create-wallet"
    ],
    methods: {
        formatEUR(value) {
            return `${Number(value).toFixed(2)}\u20AC`;
        },
        parseAmountInput(rawValue) {
            const normalized = String(rawValue).replace(",", ".");
            const parsed = Number(normalized);
            return Number.isFinite(parsed) ? parsed : 0;
        }
    },
    template: /*html*/ `
        <div class="wallet-form">
            <h2>Kryptowährung kaufen</h2>

            <label for="currency-select">Kryptowährung:</label>
            <select
                id="currency-select"
                :value="selectedCurrency"
                @change="$emit('update:selected-currency', $event.target.value)"
            >
                <option
                    v-for="currency in currencyOptions"
                    :key="currency.symbol"
                    :value="currency.symbol"
                >
                    {{ currency.symbol }} {{ formatEUR(currency.price) }}
                </option>
            </select>

            <label for="wallet-select">Wallet:</label>
            <select
                id="wallet-select"
                :value="selectedWallet"
                @change="$emit('update:selected-wallet', Number($event.target.value))"
            >
                <option :value="null" disabled>Wallet waehlen</option>
                <option
                    v-for="wallet in walletOptions"
                    :key="wallet.id"
                    :value="wallet.id"
                >
                    {{ wallet.name }} ({{ wallet.currency }})
                </option>
            </select>

            <label for="amount-input">Menge:</label>
            <input
                id="amount-input"
                type="number"
                min="0"
                step="0.001"
                :value="amount"
                @input="$emit('update:amount', parseAmountInput($event.target.value))"
            />

            <p class="current-value">Wert: {{ formatEUR(currentValue) }}</p>

            <div class="wallet-actions">
                <button class="button" @click="$emit('buy')">Kaufen</button>
                <button class="button" :disabled="!canSell" @click="$emit('sell')">Verkaufen</button>
            </div>

            <p v-if="!canSell" class="current-value">Verkauf nur bei gleicher Wallet/Coin-Auswahl moeglich.</p>
            <p v-if="formMessage" class="current-value">{{ formMessage }}</p>

            <hr />
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
