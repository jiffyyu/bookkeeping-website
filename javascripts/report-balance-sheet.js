fetchChart1Data();
fetchChart2Data();
initVue();


async function fetchChart1Data() {
    var response = await fetch('https://api.npoint.io/677d35840ec110ce4b59', {
        method: 'get',
    });

    if (response.ok) {
        var data = await response.json();
        renderChart1(data);
    }
}

async function fetchChart2Data() {
    var response = await fetch('https://api.npoint.io/bce752c5efe88342da5b', {
        method: 'get',
    });

    if (response.ok) {
        var data = await response.json();
        renderChart2(data);
    }
}

function renderChart1(d) {
    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("TotalAssets");


        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);


        // Create chart
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
        var chart = root.container.children.push(am5percent.PieChart.new(root, {
            layout: root.verticalLayout
        }));


        // Create series
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
        var series = chart.series.push(am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category"
        }));


        // Set data
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
        series.data.setAll(d);


        // Create legend
        // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
        var legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.percent(50),
            x: am5.percent(50),
            marginTop: 15,
            marginBottom: 15
        }));

        legend.data.setAll(series.dataItems);


        // Play initial series animation
        // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
        series.appear(1000, 100);

    }); // end am5.ready()
}

function renderChart2(d) {
    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("TotalLiabilities");


        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);


        // Create chart
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
        var chart = root.container.children.push(am5percent.PieChart.new(root, {
            layout: root.verticalLayout
        }));


        // Create series
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
        var series = chart.series.push(am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category"
        }));


        // Set data
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
        series.data.setAll(d);


        // Create legend
        // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
        var legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.percent(50),
            x: am5.percent(50),
            marginTop: 15,
            marginBottom: 15
        }));

        legend.data.setAll(series.dataItems);


        // Play initial series animation
        // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
        series.appear(1000, 100);

    }); // end am5.ready()
}


function initVue() {
    new Vue({
        el: '#app',
        data: {
            data1: [],
            columns1: [{
                field: 'asset',
                label: 'Asset',
            }, {
                field: 'amount',
                label: 'Amount',
            }, {
                field: 'percentage',
                label: 'Percentage',
            }],
            data2: [],
            columns2: [{
                field: 'liability',
                label: 'Liability',
            }, {
                field: 'amount',
                label: 'Amount',
            }, {
                field: 'percentage',
                label: 'Percentage',
            }]
        },
        methods: {
            fetchData1: async function() {
                var response = await fetch("https://api.npoint.io/f54bcb060c08e48fdd43");

                if (response.ok) {
                    var tableData = await response.json();
                    this.data1 = tableData;
                } else {
                    alert(response.statusText);
                }
            },
            fetchData2: async function() {
                var response = await fetch("https://api.npoint.io/23a14f862435dc4b9410");

                if (response.ok) {
                    var tableData = await response.json();
                    this.data2 = tableData;
                } else {
                    alert(response.statusText);
                }
            },
        },
        mounted: function() {
            this.fetchData1();
            this.fetchData2();
        },
    });
}