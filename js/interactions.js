// interactions.js

const populateFilters = (data) => {
    const filterDiv = d3.select("#filters_screen");
  
    // Remove old buttons (if re-rendering)
    filterDiv.selectAll("*").remove();
  
    // Create buttons for each filter
    const buttons = filterDiv.selectAll("button")
      .data(filters_screen)
      .enter()
      .append("button")
      .attr("class", d => d.isActive ? "active" : "")
      .text(d => d.label)
      .on("click", (event, d) => {
        // Toggle active state
        filters_screen.forEach(f => f.isActive = false);
        d.isActive = true;
  
        // Update button visuals
        buttons.classed("active", btn => btn.isActive);
  
        // Update histogram
        updateHistogram(d.id, data);
      });
  };
 // interactions.js -> updateHistogram (replace existing updateHistogram)
const updateHistogram = (selectedId, data) => {
    // filter
    let filtered = data;
    if (selectedId && selectedId !== "all") {
      filtered = data.filter(d => (d.screenTech === selectedId) );
    }
  
    // validate
    const validData = filtered.filter(d => typeof d.screenSize === "number" && !isNaN(d.screenSize));
    console.log("updateHistogram - selected:", selectedId, "rows:", filtered.length, "valid:", validData.length);
  
    if (validData.length === 0) {
      // remove bars
      const svg = d3.select("#histogram svg g");
      svg.selectAll("rect").remove();
      svg.select(".x-axis").call(d3.axisBottom(d3.scaleLinear().range([0,width])));
      svg.select(".y-axis").call(d3.axisLeft(d3.scaleLinear().range([height,0])));
      return;
    }
  
    // local bin generator
    const localBin = d3.bin()
      .value(d => d.screenSize)
      .domain(d3.extent(validData, d => d.screenSize))
      .thresholds(binGenerator.thresholds ? binGenerator.thresholds() : 15);
  
    const bins = localBin(validData);
    const cleanBins = bins.filter(b => typeof b.x0 === "number" && typeof b.x1 === "number");
  
    const x = d3.scaleLinear()
      .domain([d3.min(cleanBins, d => d.x0), d3.max(cleanBins, d => d.x1)])
      .range([0, width]);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanBins, d => d.length) || 1])
      .nice()
      .range([height, 0]);
  
    const svg = d3.select("#histogram svg g");
  
    const bars = svg.selectAll("rect").data(cleanBins, d => d.x0);
  
    // exit
    bars.exit()
      .transition().duration(300)
      .attr("y", y(0))
      .attr("height", 0)
      .remove();
  
    // update
    bars.transition().duration(400)
      .attr("x", d => x(d.x0))
      .attr("y", d => y(d.length))
      .attr("width", d => {
        const w = x(d.x1) - x(d.x0) - 1;
        return (isFinite(w) && w > 0) ? w : 0;
      })
      .attr("height", d => height - y(d.length));
  
    // enter
    bars.enter()
      .append("rect")
      .attr("x", d => x(d.x0))
      .attr("width", 0)
      .attr("y", y(0))
      .attr("height", 0)
      .style("fill", "#69b3a2")
      .style("stroke", "#fff")
      .transition().duration(400)
        .attr("width", d => {
          const w = x(d.x1) - x(d.x0) - 1;
          return (isFinite(w) && w > 0) ? w : 0;
        })
        .attr("y", d => y(d.length))
        .attr("height", d => height - y(d.length));
  
    // update axes
    svg.select(".x-axis").transition().duration(300).call(d3.axisBottom(x));
    svg.select(".y-axis").transition().duration(300).call(d3.axisLeft(y));
  };
  

  // === Tooltip for scatterplot ===
const createTooltipScatter = () => {
    const tooltip = innerChartS
    .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
    tooltip.append("rect")
      .attr("width", tooltipWidth)
      .attr("height", tooltipHeight)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", "#69b3a2")
      .attr("opacity", 0.8);
  
    tooltip.append("text")
      .attr("x", tooltipWidth / 2)
      .attr("y", tooltipHeight / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "white")
      .style("font-size", "12px");
  
    return tooltip;
  };
  
  // === Handle mouse events for scatterplot ===
  const handleScatterEvents = (tooltip) => {
    innerChartS.selectAll("circle")
    .on("mouseenter", function (event, d) {
        console.log("Mouse enter circle", d);
      
        const [x, y] = [this.getAttribute("cx"), this.getAttribute("cy")];
      
        // ✅ Cập nhật nội dung tooltip
        tooltip.select("text")
          .text(`${d.brand || 'Unknown'} (${d.screenSize || '?'} / ${d.energyConsumption || '?'})`);
      
        // ✅ Hiện tooltip và đưa nó lên trên các phần tử khác
        tooltip.raise();  
        tooltip.transition().duration(150)
          .style("opacity", 1);
      
        // ✅ Di chuyển tooltip đến vị trí hợp lý hơn
        tooltip.attr("transform", `translate(${+x + 15}, ${+y - 25})`);
      })
    }