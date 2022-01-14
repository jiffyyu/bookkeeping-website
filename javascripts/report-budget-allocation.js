initVue();
function initVue() {
  var app = new Vue({
    el: "#app",
    data: {
      data: [],
      columns: [
        {
          field: "unit",
          label: "Unit",
        },
        {
          field: "food",
          label: "Food",
        },
        {
          field: "healthcare",
          label: "Healthcare",
        },
        {
          field: "clothing",
          label: "Clothing",
        },
        {
          field: "study",
          label: "Study",
        },
        {
          field: "transportation",
          label: "Transportation",
        },
        {
          field: "furniture",
          label: "Furniture",
        },
        {
          field: "entertainment",
          label: "Entertainment",
        },
      ],
    },
    methods: {
      fetchData: async function () {
        var response = await fetch(
          "https://api.npoint.io/e1af94bcff26c8b3fef3"
        );

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
fetchChart1Data();
      async function fetchChart1Data() {
        var response = await fetch(
          "https://api.npoint.io/332f04bde700012db8f1",
          {
            method: "get",
          }
        );

        if (response.ok) {
          var data = await response.json();
          renderChart1(data);
        }
      }
      function renderChart1(d) {
        am5.ready(function () {
          // Create root element
          // https://www.amcharts.com/docs/v5/getting-started/#Root_element
          var root = am5.Root.new("chartdiv");

          // Set themes
          // https://www.amcharts.com/docs/v5/concepts/themes/
          root.setThemes([am5themes_Animated.new(root)]);

          // Create chart
          // https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/
          var chart = root.container.children.push(
            am5percent.SlicedChart.new(root, {
              layout: root.verticalLayout,
            })
          );

          // Create series
          // https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/#Series
          var series = chart.series.push(
            am5percent.PyramidSeries.new(root, {
              orientation: "vertical",
              valueField: "value",
              categoryField: "category",
            })
          );

          // Set data
          // https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/#Setting_data
          series.data.setAll(d.reverse());

          // Play initial series animation
          // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
          series.appear();

          // Create legend
          // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
          var legend = chart.children.push(
            am5.Legend.new(root, {
              centerX: am5.percent(50),
              x: am5.percent(50),
              marginTop: 15,
              marginBottom: 15,
            })
          );

          legend.data.setAll(am5.array.copy(series.dataItems).reverse());

          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          chart.appear(1000, 100);
        });
      } // end am5.ready()

      //d3.chart
      fetchChartData();
      async function fetchChartData() {
           var response = await fetch(
             "https://api.npoint.io/34468a60016975578924",
             {
               method: "get",
             }
           );
   
           if (response.ok) {
             var data = await response.json();
             renderChart(data);
           }
         }
         function renderChart(d) {
         var data = d;
   
         // Set the dimensions of our chart to be displayed
         var barsWidth = 500,
           barsHeight = 400,
           axisMargin = 100;
   
         var chartHeight = barsHeight + axisMargin,
           chartWidth = barsWidth + axisMargin;
   
         // Select the chart element on the page so we can reference it in code
         // Also set the width and height attributes of the chart SVG
         var chart = d3
           .select("#chart")
           .attr("width", chartWidth + 100)
           .attr("height", chartHeight);
   
         // Create a linear scale for our y-axis to map datapoint values to pixel heights of bars
         var yScale = d3
           .scaleLinear()
           .domain([
             0,
             d3.max(data, function (d) {
               // return the value property of each datapoint so the max function can compare
               return d.value;
             }),
           ])
           .rangeRound([barsHeight, 0]);
   
         // Create a scale that returns the bands each bar should be in along the x-axis
         let xScale = d3
           .scaleBand()
           .domain(
             data.map(function (d) {
               // For each datapoint in our data array
               // Return the name property into our new domain array
               return d.name;
             })
           )
           .rangeRound([0, barsWidth])
           .padding(0.1);
   
         // Create an SVG group that we will add the individual bar elements of our chart to
         var bars = chart.append("g").attr("id", "bars-container");
   
         // Bind the data to our .bars svg elements
         // Create a rectangle for each data point and set position and dimensions using scales
         bars
           .selectAll(".bar")
           .data(data)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("x", function (d) {
             return xScale(d.name);
           })
           .attr("y", function (d) {
             return yScale(d.value);
           })
           .attr("width", xScale.bandwidth())
           .attr("height", function (d) {
             return barsHeight - yScale(d.value);
           });
   
         // Move the bars so that there is space on the left for the y-axis
         bars.attr("transform", "translate(" + axisMargin + ",0)");
   
         // Create a new SVG group for the y-axis elements
         // Generate the y-axis with 10 ticks and move into position
         yAxis = chart
           .append("g")
           .attr("id", "y-axis")
           .call(d3.axisLeft(yScale).ticks(10))
           .attr("transform", "translate(" + axisMargin + ",0)");
   
         // Create another group for the x-axis elements
         // Generate the x-axis using the our x scale and move into positon
         // Select the text elements and rotate by 45 degrees
         xAxis = chart
           .append("g")
           .attr("id", "x-axis")
           .call(d3.axisBottom(xScale))
           .attr("transform", "translate(" + axisMargin + "," + barsHeight + ")")
           .selectAll("text")
           .style("text-anchor", "start")
           .attr("transform", "rotate(45)");
         }
 