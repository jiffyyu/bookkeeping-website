initVue();
fetchChart1Data();

function initVue() {
    new Vue({
        el: '#app',
    });
}

async function fetchChart1Data() {
    var response = await fetch('https://api.npoint.io/6b19b92d64371f424815', {
        method: 'get',
    });

    if (response.ok) {
        var data = await response.json();
        renderChart1(data);
    }
}

function renderChart1(d) {
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
        'November',
    ];

    const data = {
        labels: labels,
        datasets: [{
            label: 'Income',
            backgroundColor: "rgba(225, 103, 206, 0.3)",
            borderColor: "rgb(225, 103, 206)",
            pointBackgroundColor: "rgb(10, 14, 22)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(10, 14, 22)",
            data: d[0],
        }, {
            label: 'Expenses',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(99, 12, 25)',
            pointBackgroundColor: "rgb(103, 148, 220)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(103, 148, 220)",
            data: d[1],
        }, {
            label: 'Balance',
            backgroundColor: "rgba(103, 148, 220, 0.3)",
            borderColor: "rgb(103, 148, 220)",
            pointBackgroundColor: "rgb(225, 103, 206)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(225, 103, 206)",
            data: d[2],
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {

            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Income and Expense Trend Chart(2021.01.01 - 2021.11.26)',
                    font: {
                        size: 24
                    },
                    padding: 20
                },
                legend: {
                    display: true
                },

            },

        }
    };

    var myChart = new Chart(
        document.getElementById('IncomeandExpensesTrends'),
        config
    );
}


//D3.chart
fetchD3ChartData();
async function fetchD3ChartData() {
    var response = await fetch(
        "https://api.npoint.io/ad151826d5fa301cdbe8", {
            method: "get",
        }
    );

    if (response.ok) {
        var data = await response.json();
        renderD3Chart(data);
    }
}

function renderD3Chart(d) {
    var datax = [
        'July',
        'August',
        'September',
        'October',
        'November'
    ];
    var datay = d;
    // 用来保存点击时的状态
    var legendStatus = [true, true, true];

    var width = 800,
        height = 400,
        padding = {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40
        };
    var sp = d3.schemeSet2;
    var svg = d3.select("#D3chart")
        .append('svg')
        .attr('width', width + 'px')
        .attr('height', height + 'px');

    // x轴
    var xScale = d3.scaleOrdinal()
        .domain(datax)
        .range([100, 200, 300, 400, 500]);
    var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickSize(10);
    svg.append('g')
        .call(xAxis)
        .attr("transform", "translate(0," + (height - padding.bottom) + ")")
        .selectAll("text")
        .attr("dx", "50px");

    // y轴      
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(d3.merge([datay[0], datay[1], datay[2]]))])
        .range([height - padding.bottom, padding.top]);
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);
    svg.append('g')
        .call(yAxis)
        .attr("transform", "translate(" + 100 + ",0)");

    datay.forEach(function(item, index) {
        var bar = svg.selectAll(".bar" + index)
            .data(item)
            .enter().append("g")
            .attr("class", "bar" + index)
            .attr("transform", function(d, i) {
                var _d = (100 / datay.length) * (index);
                return "translate(" + (xScale(i * 100) + _d) + "," + yScale(d) + ")";
            });

        // 柱
        bar.append("rect")
            .attr("x", 1)
            .attr("width", (100 / datay.length))
            .attr("height", function(d) {
                return height - yScale(d) - padding.bottom;
            })
            .attr("stroke", "White")
            .attr("fill", sp[index]);

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", 100 / (datay.length * 2))
            .attr("text-anchor", "middle")
            .attr("font-size", "8px")
            .attr("fill", "White")
            .text(function(d) {
                return d;
            });

        // 图例
        var legend = svg.append('g');
        var line = legend.append('line')
            .attr('x1', 0)
            .attr('y1', 2)
            .attr('x2', 15)
            .attr('y2', 2)
            .attr('stroke', sp[index])
            .attr('stroke-width', 5);
        var text = legend.append('text')
            .attr('class', 'legend-label')
            .attr("dy", -13)
            .style("text-anchor", "start")
            .text("data" + index)
            .attr('fill', "Black")
            .attr('font-size', '13')
            .attr("transform", "translate(" + 18 + "," + 20 + ")");
        // 图例对应的点击事件	
        legend.attr("transform", "translate(" + (padding.left * 3 + index * 100) + "," + padding.top / 2 + ")")
            .on("click", function() {
                var _this = d3.select(this);
                var _i = parseInt(_this.select("text").text().split("data")[1]);

                if (legendStatus[_i]) {
                    _this.selectAll("line").attr("stroke", "#d3d3d3");
                    _this.selectAll("text").attr("fill", "#d3d3d3");

                    svg.selectAll(".bar" + _i)
                        .attr("display", "none");
                } else {
                    _this.selectAll("line").attr("stroke", sp[_i]);
                    _this.selectAll("text").attr("fill", "#Black");

                    svg.selectAll(".bar" + _i)
                        .attr("display", "show");
                }

                legendStatus[_i] = !legendStatus[_i];
            });
    });
}