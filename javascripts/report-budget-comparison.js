initVue();
fetchData();

function initVue() {
    new Vue({
        el: '#app',
    });
}

async function fetchData() {
    const response = await fetch('https://api.npoint.io/2305c1ad735fe07a28a4');
    const data = await response.json();
    renderChart(data);
    renderD3Chart(data);
}

function renderChart(d) {
    const data = {
        labels: ['Daily Shopping', 'Traffic', 'Telephone Bill', 'Study', 'Health Care', 'Travelling'],
        datasets: [
            {
                label: 'Budget',
                data: d[0],
                backgroundColor: ['rgba(220, 103, 206, .8)'],
            },
            {
                label: 'Actual Expenditure',
                data: d[1],
                backgroundColor: ['rgba(103, 113, 220, .8)'],
            }
        ]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Budget & Expenditure Comparison in 2020'
                }
            }
        },
    };
    const myChart = new Chart(
        document.getElementById('chartBudgetComparison'),
        config
    );
}

function renderD3Chart(d) {
    // Step 3
    var svg = d3.select("svg"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = 180;

    // Step 1        
    // var data = [{ name: "Alex", share: 20.70 },
    // { name: "Shelly", share: 30.92 },
    // { name: "Clark", share: 15.42 },
    // { name: "Matt", share: 13.65 },
    // { name: "Jolene", share: 19.31 },
    // { name: "Alexs", share: 23.31 }];
    const labels = ['Daily Shopping', 'Traffic', 'Telephone', 'Study', 'Health Care', 'Travelling'];
    const actualArr = d[1];
    const data = actualArr.map((item, index) => {
        return {
            name: labels[index],
            share: item
        }
    });

    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Step 4
    var ordScale = d3.scaleOrdinal()
        .domain(data)
        .range([
            'rgba(103, 183, 220, 0.8)',
            'rgba(103, 148, 220, 0.8)',
            'rgba(103, 113, 220, 0.8)',
            'rgba(128, 103, 220, 0.8)',
            'rgba(163, 103, 221, 0.8)',
            'rgba(220, 103, 206, 0.8)'
        ]);

    // Step 5
    var pie = d3.pie().value(function (d) {
        return d.share;
    });

    var arc = g.selectAll("arc")
        .data(pie(data))
        .enter();

    // Step 6
    var path = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    arc.append("path")
        .attr("d", path)
        .attr("fill", function (d) { return ordScale(d.data.name); });

    // Step 7
    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    arc.append("text")
        .attr("transform", function (d) {
            console.log('d:', label.centroid(d));
            return "translate(" + label.centroid(d) + ")";
        })
        .text(function (d) { return d.data.name; })
        .style("font-family", "arial")
        .style("font-size", 12);
}