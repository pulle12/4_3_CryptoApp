/* const app = new Vue({
    el: '#app',
    data: {
        credentials: []
    },
    methods: {
        hallo: function (event) {
            alert('Hello !');
        }
    },

    created(){
        fetch("http://localhost/projects/passwortmanager-2/api.php?r=credentials/")
            .then(response => response.json())
            .then(data => (this.credentials = data))
    }

}) */

$(document).ready(function () {
    function getCryptoPrices() {
        $.ajax({
            url: 'https://api.bitpanda.com/v1/ticker',
            method: 'GET',
            success: function (data) {
                console.log("Daten empfangen:", data);

                if (data.BTC) $('#btc').text(data.BTC.EUR);
                if (data.ETH) $('#eth').text(data.ETH.EUR);
                if (data.LTC) $('#ltc').text(data.LTC.EUR);
            },
            error: function (xhr) {
                console.error("Fehler:", xhr.statusText);
                $('#btc').text("Fehler beim Laden");
            }
        });
    }

    getCryptoPrices();

    setInterval(getCryptoPrices, 30000);
});

