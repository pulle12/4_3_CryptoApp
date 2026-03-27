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
