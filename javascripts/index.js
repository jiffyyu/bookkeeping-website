initVue();

function initVue() {
    new Vue({
        el: '#app',
        data: {
            storys: [],
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            getImgUrl(value) {
                value += 40;
                return `https://picsum.photos/id/10${value}/1230/500`;
            },
            fetchData: async function () {
                var response = await fetch("https://api.npoint.io/b4f1074335be20031e4c");
                this.storys = await response.json();
            },
        },
    });
}