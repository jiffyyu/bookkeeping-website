initVue();
fetchData();

function initVue() {
    new Vue({
        el: '#app',
    });
}

async function fetchData() {
    const response = await fetch('https://api.npoint.io/d676addc08c2bd8b5c93');
    const data = await response.json();
    renderChart(data);
    renderD3Chart(data);
}

function renderChart(d) {
    const labels = [
        'First Quarter',
        'Second Quarter',
        'Third Quarter',
        'Fourth Quarter',
    ];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Expenditure',
                data: d[0],
                backgroundColor: ['rgba(220, 103, 206, .8)'],
            },
            {
                label: 'Income',
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
                    text: 'Cash Flow in 2020'
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        },
    };
    const myChart = new Chart(
        document.getElementById('chartCashFlow'),
        config
    );
}

function renderD3Chart(d) {
    const incomeArr = d[1];
    const labels = [
        'First Quarter',
        'Second Quarter',
        'Third Quarter',
        'Fourth Quarter',
    ];
    // var abuses = [
    //     { district: "First", cases: 50, },
    //     { district: "Second", cases: 60,},
    //     { district: "Third", cases: 70, },
    //     { district: "Forth", cases: 80, },
    // ];
    const abuses = incomeArr.map((item, index) => {
        return {
            district: labels[index],
            cases: item/1000
        }
    });
    console.log(abuses);

    const arr = [40, 70, 100];
    var myScale = d3.scaleLinear().domain(arr).range([100, 400, 700]);
    var myColorScale = d3.scaleLinear().domain(arr).range(["rgba(103, 183, 220, 0.8)", "rgba(103, 113, 220, 0.8)", "rgba(220, 103, 206, 0.8)"]);

    var svg = d3.select("svg");

    // Code for Force Layout Simulator
    var simulation = d3.forceSimulation()
        .force("collide", d3.forceCollide().radius(function (d) { return d.cases + 5; }))
        // .force("center", d3.forceCenter(400, 240));
        .force('x', d3.forceX().x(function (d) {
            return myScale(d.cases);
        }))
        .force('y', d3.forceY().strength(0.01).y(function (d) {
            return 480;
        }));

    simulation.nodes(abuses);

    svg.append("g")
        .attr("transform", "translate(0, 450)")
        .call(d3.axisBottom(myScale));

    var circles = svg.selectAll("circle")
        .data(abuses)
        .enter().append('circle')
        .attr('r', function (d) {
            return d.cases;
        })
        .attr('fill', function (d) {
            return myColorScale(d.cases);
        });

    simulation.on("tick", function () {
        circles
            .attr("cx", function (d) {
                return d.x
            })
            .attr("cy", function (d) {
                return d.y
            })
    });

    var tooltip = d3.select("#tooltip");
    var title = d3.select("#title");
    var subtitle = d3.select("#subtitle");

    circles
        .on("mouseover", function (event, d) {
            tooltip.style("display", "block");

            title.text(d.district);
            subtitle.text("Income:" + d.cases);
        })
        .on("mouseout", function () {
            tooltip.style("display", "none");
        })
        .on('mousemove', function (event) {
            let coords = d3.pointer(event);
            tooltip
                .style("left", (coords[0] + 15) + "px")
                .style("top", (coords[1] - 25) + "px");
        });
}