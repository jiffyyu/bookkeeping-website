initVue();

function initVue() {
    new Vue({
        el: '#app',
        data: {
            username: '',
            password: '',
        },
        mounted() {
        },
        methods: {
            login: async function() {
                var response = await fetch("https://api.npoint.io/753b9337c8017b19b751");
                if (response.ok) {
                    location.href = "overview.html";
                }
            }
        },
    });
}