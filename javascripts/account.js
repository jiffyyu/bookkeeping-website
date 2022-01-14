initVue();

function initVue() {

    var app = new Vue({
        el: '#app',
        data: {
            tableData: [],

            isPaginated: true,
            isPaginationSimple: false,
            isPaginationRounded: false,
            paginationPosition: 'bottom',
            defaultSortDirection: 'asc',
            currentPage: 1,
            perPage: 5
        },
        methods: {
            fetchData: async function() {
                var response = await fetch("https://api.npoint.io/aaf37044397be59ab0a2");

                if (response.ok) {
                    var tableData = await response.json();
                    this.tableData = tableData;
                } else {
                    alert(response.statusText);
                }
            },
        },
        mounted: function() {
            this.fetchData();
        },
    });
}