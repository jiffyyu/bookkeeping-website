initVue();
function initVue() {
    new Vue({
        el: "#app",
        data: {
            data: [],
            columns: [
                {
                    field: "income",
                    label: "Total income",
                    centered: true,
                },
                {
                    field: "wages",
                    label: "Wages",
                    centered: true,
                },
                {
                    field: 'financial',
                    label: "Financial Management",
                    centered: true,
                },
                {
                    field: "gift",
                    label: "Gift",
                    centered: true,
                },
                {
                    field: "dividends",
                    label: "Dividends",
                    centered: true,
                },
                {
                    field: "shares",
                    label: "Shares",
                    centered: true,
                },
            ],
        },
        methods: {
            fetchData: async function () {
                var response = await fetch("https://api.npoint.io/ab3b6fe0501fbe2839d7");

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
fetchData();
async function fetchData() {
    const response = await fetch('https://api.npoint.io/3b1f8056d85b2268d4dc');
    const data = await response.json();
    renderChart(data);
}
function renderChart(d) {
    const data = {
        labels: [
            'Wages',
            'Financial Management',
            'Gift',
            'Dividends',
            'Shares',
        ],
        datasets: [{
            label: 'My First Dataset',
            data: d,
            backgroundColor: [
                'rgba(103, 183, 220, 0.8)',
                'rgba(103, 148, 220, 0.8)',
                'rgba(103, 113, 220, 0.8)',
                'rgba(163, 103, 221, 0.8)',
                'rgba(220, 103, 206, 0.8)'
            ]
        }]
    };
    const config = {
        type: 'polarArea',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Distribution of revenue sources",
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
fetchData1();
async function fetchData1() {
    const response = await fetch('https://api.npoint.io/890f9e0a443b5435dddc');
    const data = await response.json();
    d3Chart(data);
}
function d3Chart(d) {

    var abuses = d;

    var myScale = d3.scaleLinear().domain([14, 19, 43]).range([100, 400, 700]);
    var myColorScale = d3.scaleLinear().domain([14, 19, 43]).range(["blue", "pink", "purple"]);

    var svg = d3.select("svg");

    // Code for Force Layout Simulator
    var simulation = d3.forceSimulation()
        .force("collide", d3.forceCollide().radius(function (d) { return d.cases + 5; }))
        // .force("center", d3.forceCenter(400, 240))
        .force('x', d3.forceX().x(function (d) {
            return myScale(d.cases);
        }))
        .force('y', d3.forceY().strength(0.01).y(function (d) {
            return 480;
        }));

    svg.append("g")
        .attr("transform", "translate(0, 450)")
        .call(d3.axisBottom(myScale));
    simulation.nodes(abuses);
    var circles = svg.selectAll("circle")
        .data(abuses)
        .enter().append('circle')
        .attr('r', 30)
        .attr('fill', "blue")
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
    var circles = d3.selectAll("circle");

    var tooltip = d3.select("#tooltip");
    var title = d3.select("#title");
    var subtitle = d3.select("#subtitle");

    circles
        .on("mouseover", function (event, d) {
            tooltip.style("display", "block");

            title.text(d.district);
            subtitle.text('￥' + d.cases + "K net income");
        })
        .on("mouseout", function () {
            tooltip.style("display", "none");
        })
        .on('mousemove', function (event) {
            let coords = d3.pointer(event);
            tooltip
                .style("left", (coords[0] + 15) + "px")
                .style("top", (coords[1] - 95) + "px");
        });
}