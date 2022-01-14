fetchChart1Data();
fetchChart2Data();
initVue();

async function fetchChart1Data() {
    var response = await fetch('https://api.npoint.io/bd0c8c7e3ea9046e5a9d', {
        method: 'get',
    });

    if (response.ok) {
        var data = await response.json();
        renderChart1(data);
    }
}

async function fetchChart2Data() {
    var response = await fetch('https://api.npoint.io/83605d43e35b3d604bfc', {
        method: 'get',
    });

    if (response.ok) {
        var data = await response.json();
        renderChart2(data);
    }
}

function renderChart1(d) {
    const data = {
        labels: [
            'Home Property',
            'Learning',
            'Personal Interests',
            'Food and drink',
            'Leisure and entertainment',
            'Daily Shopping',
            'Clothing and Accessories',
            'Medical care',
            'Communication',
            'Transportation'
        ],
        datasets: [{

            data: d,
            backgroundColor: [
                '#E04545',
                '#F56F33',
                '#F6A634',
                '#FFBF4D',
                '#C0F66A',
                '#A7DD51',
                '#37C376',
                '#1ECFD1',
                '#2AACD8',
                '#839BFF',
            ],
            hoverOffset: 10
        }]

    };
    const config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Expenses by category for the year',
                    font: {
                        size: 15
                    },
                    padding: 20
                },
            },
        }
    };
    var myChart = new Chart(
        document.getElementById('myChart2'),
        config
    );
}

function renderChart2(d) {
    const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November'
    ];
    const data = {
        labels: labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: '#48C78E',
            borderColor: '#48C78E',
            data: d,
        }]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Expenditure trend chart for the year',
                    font: {
                        size: 15
                    },
                    padding: 20
                },
                legend: {
                    display: false
                }
            },
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}

function initVue() {
    var app = new Vue({
        el: "#app",
        data: {
            tableData: [],
        },
        methods: {
            fetchData: async function () {
                var response = await fetch("https://api.npoint.io/006c211a7a6c28c7ca1f");

                if (response.ok) {
                    var tableData = await response.json();
                    this.tableData = tableData;
                } else {
                    alert(response.statusText);
                }
            },
        },
        mounted: function () {
            this.fetchData();
        },
    });
}