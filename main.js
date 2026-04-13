const app = new Vue({
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

})

$(document).ready(function () {
    $.get('https://api.bitpanda.com/v1/ticker', function (data) {
        $('#btc').text(data.BTC_EUR.last_price);
        $('#eth').text(data.ETH_EUR.last_price);
        $('#ltc').text(data.LTC_EUR.last_price);
    })
})