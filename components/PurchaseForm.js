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
        }
    },
    emits: ["update:selected-currency", "update:amount", "buy"],
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
            <h2>Kryptowaehrung kaufen</h2>

            <label for="currency-select">Kryptowaehrung:</label>
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

            <button class="button" @click="$emit('buy')">Kaufen</button>
        </div>
    `
};
