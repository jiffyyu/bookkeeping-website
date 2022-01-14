initVue();
fetchData();
// renderChartD3Stack();

function initVue() {
    new Vue({
        el: '#app',
    });
}

async function fetchData() {
    const response = await fetch('https://api.npoint.io/ed7d76fec41741be6c81');
    const data = await response.json();
    renderChart(data);
    renderChartD3Stack(data);
}

function renderChart(d) {
    const labels = [
        '2016',
        '2017',
        '2018',
        '2019',
        '2020',
    ];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Average Comsumption',
                data: d[0],
                borderColor: ['rgba(220, 103, 206, 1'],
                backgroundColor: ['rgba(220, 103, 206, .8)'],
                stack: 'combined',
                type: 'bar'
            },
            {
                label: 'Actual Comsumption',
                data: d[1],
                borderColor: ['rgba(103, 113, 220, 1)'],
                backgroundColor: ['rgba(103, 113, 220, .8)'],
                stack: 'combined'
            }
        ]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Consumption Level from 2016 to 2020'
                }
            },
            scales: {
                y: {
                    stacked: true
                }
            }
        },
    };
    const myChart = new Chart(
        document.getElementById('chartConsumptionLevel'),
        config
    );
}

function renderChartD3Stack(d) {
    var colors = ['rgba(220, 103, 206, .8)', 'rgba(103, 113, 220, .8)'];

    // var data = [
    //     { day: '2016', average: 80, actual: 82},
    //     { day: '2017', average: 82, actual: 84.5},
    //     { day: '2018', average: 84, actual: 94},
    //     { day: '2019', average: 86, actual: 98},
    //     { day: '2020', average: 90, actual: 105}
    // ];
    const data = [];
    const averageArr = d[0];
    const actualArr = d[1];
    const ratio = 500;
    for (var i = 0; i < averageArr.length; i++) {
        data.push({
            average: averageArr[i] / ratio,
            actual: (averageArr[i] + actualArr[i]) / ratio,
        });
    }

    var stack = d3.stack()
        .keys(['average', 'actual']);

    var stackedSeries = stack(data);

    // Create a g element for each series
    var g = d3.select('g')
        .selectAll('g.series')
        .data(stackedSeries)
        .enter()
        .append('g')
        .classed('series', true)
        .style('fill', function (d, i) {
            return colors[i];
        });

    // For each series create a rect element for each day
    g.selectAll('rect')
        .data(function (d) {
            return d;
        })
        .join('rect')
        .attr('width', function (d) {
            return d[1] - d[0];
        })
        .attr('x', function (d) {
            return d[0];
        })
        .attr('y', function (d, i) {
            return i * 20;
        })
        .attr('height', 19);
}