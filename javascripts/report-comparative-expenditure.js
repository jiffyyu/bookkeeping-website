initVue();
fetchData();
fetchd3();
function initVue() {
    new Vue({
        el: "#app",
        data: {
            data: [],
            columns: [
                {
                    field: "year",
                    label: "Year",
                    centered: true,
                },
                {
                    field: "clothes",
                    label: "Clothes",
                    centered: true,
                },
                {
                    field: "food",
                    label: "Food",
                    centered: true,
                },
                {
                    field: "communication",
                    label: "Communication",
                    centered: true,
                },
                {
                    field: "leisure",
                    label: "Leisure",
                },
                {
                    field: "medical_care",
                    label: "Medical care",
                    centered: true,
                },
            ],
        },
        methods: {
            fetchData: async function () {
                var response = await fetch("https://api.npoint.io/12b019afa6bbf84c97d0");

                if (response.ok) {
                    var data = await response.json();
                    this.data = data;
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

async function fetchData() {
    const response = await fetch('https://api.npoint.io/57a102de728474181f83');
    const data = await response.json();
    renderChart(data);
}
function renderChart(d) {
    const data = {
        labels: [
            "Clothes",
            "Food",
            "Communication",
            "Leisure",
            "Medical care",
        ],
        datasets: [
            {
                label: "Expenditure Overview 2020",
                data: d[0],
                fill: true,
                backgroundColor: "rgba(225, 103, 206, 0.3)",
                borderColor: "rgb(225, 103, 206)",
                pointBackgroundColor: "rgb(225, 103, 206)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(225, 103, 206)",
            },
            {
                label: "Expenditure Overview 2021",
                data: d[1],
                fill: true,
                backgroundColor: "rgba(103, 148, 220, 0.3)",
                borderColor: "rgb(103, 148, 220)",
                pointBackgroundColor: "rgb(103, 148, 220)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(103, 148, 220)",
            },
        ],
    };
    const config = {
        type: "radar",
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Comparative Expenditure Statement",
                    font: {
                        size: 15,
                    },
                    padding: 20,
                },
            },
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
        },
    };

    var myChart = new Chart(document.getElementById("myChart"), config);
}

//d3.chart
async function fetchd3() {
    const response = await fetch('https://api.npoint.io/795b83be3cb3581c248e');
    const data = await response.json();
    renderChartd3(data);
}
function renderChartd3(d) {
    const data = d;

    const width = 600
    const barHeight = 30

    const x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (data) { return data.value })])

    const chart = d3.select('.chart')
        .attr('width', width)
        .attr('height', barHeight * data.length)

    const bar = chart.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', function (data, index) {
            return 'translate(0,' + index * barHeight + ')'
        })

    bar.append('rect')
        .attr('width', function (data) { return x(data.value) })
        .attr('height', barHeight - 1)

    bar.append('text')
        .attr('x', function (data) { return x(data.value) - 3 })
        .attr('y', barHeight / 2)
        .attr('dy', '.35em')
        .text(function (data) { return data.name })
}