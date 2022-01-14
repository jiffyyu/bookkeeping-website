initVue();
fetchChart1Data();
fetchChart2Data();

function initVue() {
    new Vue({
        el: '#app',
    });
}

async function fetchChart1Data() {
    var response = await fetch('https://api.npoint.io/b868931064d2b8f1720f', {
        method: 'get',
    });

    if (response.ok) {
        var data = await response.json();
        renderChart1(data);
    }
}

function renderChart1(d) {
    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("DailyExpense");

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "none",
                wheelY: "none"
            })
        );

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
        });
        xRenderer.labels.template.setAll({
            text: "{realName}"
        });

        var xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                maxDeviation: 0,
                categoryField: "category",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{realName}"
                })
            })
        );

        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 0.3,
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        var yAxis2 = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 0.3,
                syncWithAxis: yAxis,
                renderer: am5xy.AxisRendererY.new(root, {
                    opposite: true
                })
            })
        );

        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Series 1",
                xAxis: xAxis,
                yAxis: yAxis2,
                valueYField: "value",
                sequencedInterpolation: true,
                categoryXField: "category",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{provider} {realName}: {valueY}"
                })
            })
        );

        series.columns.template.setAll({
            fillOpacity: 0.9,
            strokeOpacity: 0
        });
        series.columns.template.adapters.add("fill", (fill, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", (stroke, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        var lineSeries = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: "Series 2",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "quantity",
                sequencedInterpolation: true,
                stroke: chart.get("colors").getIndex(13),
                fill: chart.get("colors").getIndex(13),
                categoryXField: "category",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{valueY}"
                })
            })
        );

        lineSeries.strokes.template.set("strokeWidth", 2);

        lineSeries.bullets.push(function() {
            return am5.Bullet.new(root, {
                locationY: 1,
                locationX: undefined,
                sprite: am5.Circle.new(root, {
                    radius: 5,
                    fill: lineSeries.get("fill")
                })
            });
        });

        // when data validated, adjust location of data item based on count
        lineSeries.events.on("datavalidated", function() {
            am5.array.each(lineSeries.dataItems, function(dataItem) {
                // if count divides by two, location is 0 (on the grid)
                if (
                    dataItem.dataContext.count / 2 ==
                    Math.round(dataItem.dataContext.count / 2)
                ) {
                    dataItem.set("locationX", 0);
                }
                // otherwise location is 0.5 (middle)
                else {
                    dataItem.set("locationX", 0.5);
                }
            });
        });

        var chartData = [];

        // Set data
        var data = d;

        // process data ant prepare it for the chart
        for (var providerName in data) {
            var providerData = data[providerName];

            // add data of one provider to temp array
            var tempArray = [];
            var count = 0;
            // add items
            for (var itemName in providerData) {
                if (itemName != "quantity") {
                    count++;
                    // we generate unique category for each column (providerName + "_" + itemName) and store realName
                    tempArray.push({
                        category: providerName + "_" + itemName,
                        realName: itemName,
                        value: providerData[itemName],
                        provider: providerName
                    });
                }
            }
            // sort temp array
            tempArray.sort(function(a, b) {
                if (a.value > b.value) {
                    return 1;
                } else if (a.value < b.value) {
                    return -1;
                } else {
                    return 0;
                }
            });

            // add quantity and count to middle data item (line series uses it)
            var lineSeriesDataIndex = Math.floor(count / 2);
            tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
            tempArray[lineSeriesDataIndex].count = count;
            // push to the final data
            am5.array.each(tempArray, function(item) {
                chartData.push(item);
            });

            // create range (the additional label at the bottom)

            var range = xAxis.makeDataItem({});
            xAxis.createAxisRange(range);

            range.set("category", tempArray[0].category);
            range.set("endCategory", tempArray[tempArray.length - 1].category);

            var label = range.get("label");

            label.setAll({
                text: tempArray[0].provider,
                dy: 30,
                fontWeight: "bold",
                tooltipText: tempArray[0].provider
            });

            var tick = range.get("tick");
            tick.setAll({
                visible: true,
                strokeOpacity: 1,
                length: 50,
                location: 0
            });

            var grid = range.get("grid");
            grid.setAll({
                strokeOpacity: 1
            });
        }

        // add range for the last grid
        var range = xAxis.makeDataItem({});
        xAxis.createAxisRange(range);
        range.set("category", chartData[chartData.length - 1].category);
        var tick = range.get("tick");
        tick.setAll({
            visible: true,
            strokeOpacity: 1,
            length: 50,
            location: 1
        });

        var grid = range.get("grid");
        grid.setAll({
            strokeOpacity: 1,
            location: 1
        });

        xAxis.data.setAll(chartData);
        series.data.setAll(chartData);
        lineSeries.data.setAll(chartData);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);

    }); // end am5.ready();
}


async function fetchChart2Data() {
    var response = await fetch('https://api.npoint.io/51fdb49850a404caa1c1', {
        method: 'get',
    });

    if (response.ok) {
        var data = await response.json();
        renderChart2(data);
    }
}

function renderChart2(d) {
    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("DailyIncome");


        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);


        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX"
        }));

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);


        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
        });
        xRenderer.labels.template.setAll({
            rotation: -90,
            centerY: am5.p50,
            centerX: am5.p100,
            paddingRight: 15
        });

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.3,
            categoryField: "Incomes",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));


        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            sequencedInterpolation: true,
            categoryXField: "Incomes",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
            })
        }));

        series.columns.template.setAll({
            cornerRadiusTL: 5,
            cornerRadiusTR: 5
        });
        series.columns.template.adapters.add("fill", (fill, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", (stroke, target) => {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });


        // Set data
        var data = d;

        xAxis.data.setAll(data);
        series.data.setAll(data);


        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);

    }); // end am5.ready();
}

//D3.chart
fetchD3Data();
async function fetchD3Data() {
    const response = await fetch('https://api.npoint.io/643cc4a7d979c0ea145a');
    const data = await response.json();
    D3Chart(data);
}

function D3Chart(d) {

    var abuses = d;

    var myScale = d3.scaleLinear().domain([1, 2, 3, 5, 8]).range([100, 200, 350, 550, 800]);
    var myColorScale = d3.scaleLinear().domain([1, 2, 3, 5, 8]).range(["rgb(118 190 223)", "rgb(119 158 223)", "rgb(140 119 223)", "rgb(224 119 179)", "rgb(205 118 224)"]);

    var svg = d3.select("svg");

    // Code for Force Layout Simulator
    var simulation = d3.forceSimulation()
        .force("collide", d3.forceCollide().radius(function(d) { return d.cases + 5; }))
        // .force("center", d3.forceCenter(400, 240))
        .force('x', d3.forceX().x(function(d) {
            return myScale(d.cases);
        }))
        .force('y', d3.forceY().strength(0.01).y(function(d) {
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
        .attr('r', function(d) {
            return 12 * d.cases;
        })
        .attr('fill', function(d) {
            return myColorScale(d.cases);
        });
    simulation.on("tick", function() {
        circles
            .attr("cx", function(d) {
                return d.x
            })
            .attr("cy", function(d) {
                return d.y
            })
    });
    var circles = d3.selectAll("circle");

    var tooltip = d3.select("#tooltip");
    var title = d3.select("#title");
    var subtitle = d3.select("#subtitle");

    circles
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block");

            title.text(d.district);
            subtitle.text("HK$  " + d.cases + "  K");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        })
        .on('mousemove', function(event) {
            let coords = d3.pointer(event);
            tooltip
                .style("left", (coords[0] + 15) + "px")
                .style("top", (coords[1] - 5) + "px");
        });
}