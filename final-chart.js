 const dataUrl =
        "https://gist.githubusercontent.com/vondukeelstein/32a1d7b886a27542527bb44477260ae8/raw/a84645468e86b325715caf13f01aa7ffbd0102f4/graphchart.csv";
      function renderGDPLineChart(dataUrl) {
        function formatSI(value) {
          const string = d3.format("~s")(value);
          const prefix = string[string.length - 1];
          if (["T", "M"].includes(prefix)) {
            return `${string.slice(0, -1)} ${string[string.length - 1]}n`;
          } else if (prefix === "G") {
            return `${string.slice(0, -1)} Bn`;
          } else {
            return string;
          }
        }
        const formats = {
          "USD - trillion or hundred billion": {
            tick: formatSI,
            value: formatSI,
          },
          Perecent: {
            tick: (d) => `${d3.format(".0f")(d)}%`,
            value: (d) => `${d3.format(".1f")(d)}%`,
          },
        };
        const measures = [
          {
            name: "Nominal GDP (current USD)",
            axisText: "Nominal GDP (USD)",
            selectText: "Nominal GDP (Current USD)",
          },
          {
            name: "Real GDP (constant 2010 USD)",
            axisText: "Real GDP (2010 USD)",
            selectText: "Real GDP (Constant 2010 USD)",
          },
          {
            name: "GDP Growth (%)",
            axisText: "GDP Growth (%)",
            selectText: "GDP Growth (%)",
          },
        ];
        const dispatch = d3.dispatch(
          "namechange",
          "measurechange",
          "yearchange"
        );
        let chart,
          regionNameControl,
          countryNameControl,
          measureControl,
          yearControl;
        init();
        return { destroy };

        function destroy() {
          dispatch.on("namechange", null);
          dispatch.on("measurechange", null);
          dispatch.on("yearchange", null);
          chart.destroy();
          regionNameControl.destroy();
          countryNameControl.destroy();
          measureControl.destroy();
          yearControl.destroy();
        }

        function init() {
          d3.csv(dataUrl, d3.autoType).then((csv) => {
            // Process data
            const years = csv.columns.slice(6);
            const transformed = csv.map((d) => ({
              name: d.Name,
              measure: d.Measure,
              unit: d["Display Units"],
              color: d["Line Color Hex Code"],
              values: years.map((year) => ({ x: +year, y: d[year] })),
            }));
            const grouped = d3.group(
              transformed,
              (d) => d.measure,
              (d) => d.name
            );
            const regionNames = [
              ...new Set(
                csv
                  .filter((d) => ["Global", "Region"].includes(d.Class))
                  .map((d) => d.Name)
              ),
            ];
            const countryNames = [
              ...new Set(
                csv.filter((d) => "Country" === d.Class).map((d) => d.Name)
              ),
            ].sort();
            const names = [...regionNames, ...countryNames];

            // Containers
            const container = d3
              .select(".gdp-line-chart")
              .classed("container-fluid", true);
            container
              .append("div")
              .attr("class", "row")
              .call((row) =>
                row.append("div").attr("class", "chart-container col")
              )
              .call((row) =>
                row
                  .append("div")
                  .attr("class", "side-col")
                  .call((col) =>
                    col.append("div").attr("class", "measure-control")
                  )
                  .call((col) =>
                    col
                      .append("div")
                      .attr("class", "name-control region-name-control")
                  )
                  .call((col) =>
                    col
                      .append("div")
                      .attr("class", "name-control country-name-control")
                  )
              );
            container
              .append("div")
              .attr("class", "row")
              .call((row) =>
                row
                  .append("div")
                  .attr("class", "col")
                  .append("div")
                  .attr("class", "year-control")
                  // Match chart margin
                  .style("margin-left", "70px")
                  .style("margin-right", "120px")
              )
              .call((row) => row.append("div").attr("class", "side-col"));

            // Initialization
            const selected = {
              names: ["World"],
              measure: measures[0].name,
              years: [+years[0], +years[years.length - 1]],
            };

            chart = renderGDPLineChart(
              container.select(".chart-container"),
              grouped,
              formats
            );
            chart.update(selected);
            regionNameControl = renderNameControl(
              container.select(".region-name-control"),
              dispatch,
              "Regions",
              regionNames,
              selected.names
            );
            countryNameControl = renderNameControl(
              container.select(".country-name-control"),
              dispatch,
              "Countries",
              countryNames,
              selected.names
            );
            measureControl = renderMeasureControl(
              container.select(".measure-control"),
              dispatch,
              measures,
              selected.measure
            );
            yearControl = renderYearControl(
              container.select(".year-control"),
              dispatch,
              [+years[0], +years[years.length - 1]],
              selected.years
            );

            // Dispatch
            dispatch.on("namechange", function (name, isSelecting) {
              if (isSelecting) {
                selected.names = names.filter((d) =>
                  [...selected.names, name].includes(d)
                );
              } else {
                selected.names = selected.names.filter((d) => d !== name);
              }
              chart.update(selected);
            });

            dispatch.on("measurechange", function (measure) {
              selected.measure = measure;
              chart.update(selected);
            });

            dispatch.on("yearchange", function (yearRange) {
              selected.years = yearRange;
              chart.update(selected);
            });
          });
        }

        function renderGDPLineChart(container, data, formats) {
          const margin = { top: 30, right: 120, bottom: 40, left: 80 };
          const height = 480;
          const lineWidth = 2;
          const circleRadius = 4;
          const circleStrokeWidth = 8;
          let width, label, formatTick, formatValue, gLine, gLabel;

          const x = d3.scaleLinear();
          const y = d3
            .scaleLinear()
            .range([height - margin.bottom, margin.top]);
          const line = d3
            .line()
            .x((d) => x(d.x))
            .y((d) => y(d.y));

          const svg = container.append("svg").style("width", "100%");
          const gXAxis = svg.append("g");
          const gYAxis = svg.append("g");
          const gLines = svg.append("g");
          const gLabels = svg.append("g");

          const tooltipBox = container
            .append("div")
            .attr("class", "chart-tooltip chart-tooltip-box");
          const tooltipArrow = container
            .append("div")
            .attr("class", "chart-tooltip chart-tooltip-arrow");

          function showTooltip(d) {
            const p = d3.select(this.parentNode).datum();
            tooltipBox.html(`
              <div>${d.x}</div>
              <div><span style="color: ${p.color}">${
              p.name
            }</span>: <span style="font-weight: bold;">${formatValue(
              d.y
            )}</span></div>
            `);

            const circleBBox = this.getBoundingClientRect();
            const tooltipBBox = tooltipBox.node().getBoundingClientRect();
            const containerBBox = container.node().getBoundingClientRect();
            const padding = 12;
            let top =
              circleBBox.top - padding - tooltipBBox.height - containerBBox.top;
            let arrowTop = top + tooltipBBox.height;
            tooltipArrow.classed("up", true).classed("down", false);
            if (top < containerBBox.top) {
              top = circleBBox.bottom + padding - containerBBox.top;
              arrowTop = top;
              tooltipArrow.classed("up", false).classed("down", true);
            }
            let left =
              (circleBBox.left + circleBBox.right) / 2 -
              tooltipBBox.width / 2 -
              containerBBox.left;
            const arrowLeft = left + tooltipBBox.width / 2;
            if (left < 0) {
              left = 0;
            }
            if (left + tooltipBBox.width > containerBBox.width) {
              left = containerBBox.width - tooltipBBox.width;
            }
            tooltipBox.style("transform", `translate(${left}px,${top}px)`);
            tooltipArrow.style(
              "transform",
              `translate(${arrowLeft}px,${arrowTop}px)translate(-50%,-50%)rotate(45deg)`
            );

            tooltipBox.transition().style("opacity", 1);
            tooltipArrow.transition().style("opacity", 1);
            d3.select(this).transition().attr("stroke-opacity", 0.3);
          }

          function hideTooltip() {
            tooltipBox.transition().style("opacity", 0);
            tooltipArrow.transition().style("opacity", 0);
            d3.select(this).transition().attr("stroke-opacity", 0);
          }

          function addSeriesHighlight(d) {
            gLine
              .transition()
              .attr("opacity", (e) => (e === d ? 1 : 0.1))
              .select(".series-path")
              .attr("stroke-width", (e) =>
                e === d ? lineWidth * 1.5 : lineWidth
              );
            gLabel.transition().attr("opacity", (e) => (e === d ? 1 : 0.1));
          }

          function removeSeriesHighlight(d) {
            gLine
              .transition()
              .attr("opacity", 1)
              .select(".series-path")
              .attr("stroke-width", lineWidth);
            gLabel.transition().attr("opacity", 1);
          }

          window.addEventListener("resize", resize);
          function resize() {
            width = svg.node().clientWidth;
            svg.attr("viewBox", [0, 0, width, height]);
            x.range([margin.left, width - margin.right]);

            gXAxis.call(xAxis);
            gYAxis.call(yAxis);

            gLine
              .call((g) =>
                g
                  .select(".series-path")
                  .datum((d) => d.values)
                  .attr("d", line)
              )
              .call((g) =>
                g
                  .selectAll(".series-circle")
                  .attr("cx", (d) => x(d.x))
                  .attr("cy", (d) => y(d.y))
              );

            gLabel
              .attr("x", width - margin.right)
              .attr("y", (d) => y(d.values[d.values.length - 1].y));
          }

          function update(selected) {
            const measureData = data.get(selected.measure);
            const namesData = selected.names.map(
              (name) => measureData.get(name)[0]
            );
            const filtered = namesData.map((d) => ({
              ...d,
              values: d.values.filter(
                (e) => e.x >= selected.years[0] && e.x <= selected.years[1]
              ),
            }));
            label = selected.measure;
            const format = filtered.length
              ? formats[filtered[0].unit]
              : { tick: (d) => d, value: (d) => d };
            formatTick = format.tick;
            formatValue = format.value;

            const maxValue = d3.max(filtered, (d) =>
              d3.max(d.values, (d) => d.y)
            );
            const minValue = d3.min(filtered, (d) =>
              d3.min(d.values, (d) => d.y)
            );
            x.domain(selected.years);
            y.domain([minValue, maxValue]).nice();

            gLine = gLines
              .selectAll(".series")
              .data(filtered, (d) => d.name)
              .join((enter) =>
                enter
                  .append("g")
                  .attr("class", "series")
                  .on("mouseenter", addSeriesHighlight)
                  .on("mouseleave", removeSeriesHighlight)
                  .call((g) =>
                    g
                      .append("path")
                      .attr("class", "series-path")
                      .attr("fill", "none")
                      .attr("stroke-width", lineWidth)
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                  )
              )
              .call((g) =>
                g
                  .select(".series-path")
                  .attr("stroke", (d) => d.color)
                  .datum((d) => d.values)
              )
              .call((g) =>
                g
                  .selectAll("circle")
                  .data(
                    (d) => d.values,
                    (d) => d.x
                  )
                  .join("circle")
                  .attr("class", "series-circle")
                  .attr("r", circleRadius)
                  .attr("fill", function () {
                    return d3.select(this.parentNode).datum().color;
                  })
                  .attr("stroke", function () {
                    return d3.select(this.parentNode).datum().color;
                  })
                  .attr("stroke-width", circleStrokeWidth)
                  .attr("stroke-opacity", 0)
                  .on("mouseenter", showTooltip)
                  .on("mouseleave", hideTooltip)
              );

            gLabel = gLabels
              .selectAll(".series-label")
              .data(filtered, (d) => d.name)
              .join((enter) =>
                enter
                  .append("text")
                  .attr("class", "series-label")
                  .attr("dy", "0.32em")
                  .attr("dx", circleRadius + 4)
                  .text((d) => d.name)
              )
              .attr("fill", (d) => d.color);

            resize();
          }

          function xAxis(g) {
            g.selectAll(".tick .grid").remove();
            g.selectAll(".axis-label").remove();
            g.attr("transform", `translate(0,${height - margin.bottom})`)
              .call(
                d3
                  .axisBottom(x)
                  .tickSize(0)
                  .tickPadding(12)
                  .tickValues(
                    x
                      .ticks((x.range()[1] - x.range()[0]) / 80)
                      .filter((d) => Number.isInteger(d))
                  )
                  .tickFormat(d3.format("d"))
              )
              .call((g) => g.select(".domain").remove())
              .call((g) =>
                g.selectAll(".tick line").attr("stroke-opacity", 0.1)
              )
              .call((g) =>
                g
                  .append("text")
                  .attr("class", "axis-label")
                  .attr("x", x.range()[1])
                  .attr("y", 12)
                  .attr("dy", `${0.7 + 1.1}em`)
                  .attr("text-anchor", "middle")
                  .attr("font-weight", "bold")
                  .attr("fill", "black")
                  .text("Year")
              );
          }

          function yAxis(g) {
            g.selectAll(".tick .grid").remove();
            g.selectAll(".axis-label").remove();
            g.attr("transform", `translate(${margin.left},0)`)
              .call(
                d3
                  .axisLeft(y)
                  .tickSize(0)
                  .tickPadding(12)
                  .ticks((y.range()[0] - y.range()[1]) / 60)
                  .tickFormat(formatTick)
              )
              .call((g) => g.select(".domain").remove())
              .call((g) =>
                g
                  .selectAll(".tick line")
                  .attr("stroke-opacity", 0.1)
                  .clone()
                  .classed("grid", true)
                  .attr("x2", width - margin.left - margin.right)
              )
              .call((g) =>
                g
                  .append("text")
                  .attr("class", "axis-label")
                  .attr("dy", "1em")
                  .attr("dx", "0.35em")
                  .attr(
                    "transform",
                    `translate(${-margin.left},${margin.top})rotate(-90)`
                  )
                  .attr("text-anchor", "end")
                  .attr("font-weight", "bold")
                  .attr("fill", "black")
                  .text(label)
              );
          }

          function destroy() {
            container.selectAll("*").remove();
            window.removeEventListener("resize", resize);
          }
          return { update, destroy };
        }

        function renderNameControl(
          container,
          dispatch,
          label,
          names,
          selectedNames
        ) {
          container
            .append("div")
            .attr("class", "form-group")
            .call((div) => div.append("label").text(label))
            .call((div) =>
              div
                .append("div")
                .append("select")
                .attr(
                  "class",
                  "name-control-select selectpicker form-control form-control-sm"
                )
                .attr("multiple", "multiple")
                .attr("data-container", "body")
                .selectAll("option")
                .data(names)
                .join("option")
                .attr("selected", (d) =>
                  selectedNames.includes(d) ? "selected" : null
                )
                .attr("value", (d) => d)
                .text((d) => d)
            );

          const select = container.select(".selectpicker").node();
          $(select)
            .selectpicker()
            .on("changed.bs.select", function (
              e,
              clickedIndex,
              isSelected,
              previousValue
            ) {
              dispatch.call(
                "namechange",
                null,
                names[clickedIndex],
                isSelected
              );
            });

          function destroy() {
            $(select).selectpicker("destroy");
            container.selectAll("*").remove();
          }
          return { destroy };
        }

        function renderMeasureControl(
          container,
          dispatch,
          measures,
          selectedMeasure
        ) {
          container
            .append("div")
            .attr("class", "form-group")
            .call((div) => div.append("label").text("Metric"))
            .call((div) =>
              div
                .append("div")
                .append("select")
                .attr(
                  "class",
                  "measure-control-select selectpicker show-tick form-control form-control-sm"
                )
                .attr("data-container", "body")
                .selectAll("option")
                .data(measures)
                .join("option")
                .attr("selected", (d) =>
                  d.name === selectedMeasure ? "selected" : null
                )
                .attr("value", (d) => d.name)
                .text((d) => d.name)
            );

          $(".measure-control-select")
            .selectpicker()
            .on("changed.bs.select", function (
              e,
              clickedIndex,
              isSelected,
              previousValue
            ) {
              dispatch.call("measurechange", null, measures[clickedIndex].name);
            });

          function destroy() {
            $(".measure-control-select").selectpicker("destroy");
            container.selectAll("*").remove();
          }
          return { destroy };
        }

        function renderYearControl(container, dispatch, years, selectedYears) {
          container = container.append("div").attr("class", "form-group");
          const label = container
            .append("label")
            .call((label) => label.append("span").text("Year Range: "))
            .append("span")
            .text(selectedYears.join(" – "));
          const slider = container
            .append("div")
            .attr("class", "form-control")
            .node();
          noUiSlider
            .create(slider, {
              start: years,
              step: 1,
              margin: 1,
              connect: true,
              range: {
                min: years[0],
                max: years[1],
              },
              format: {
                to: (value) => value,
                from: (value) => value,
              },
            })
            .on("slide", function (values) {
              label.text(values.join(" – "));
              dispatch.call("yearchange", null, values);
            });

          function destroy() {
            slider.noUiSlider.destroy();
            container.selectAll("*").remove();
          }
          return { destroy };
        }
      }

      const gdpLineChart = renderGDPLineChart(dataUrl);
      // Destroy chart later
      // gdpLineChart.destroy();
