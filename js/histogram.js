// chart_histogram.js (replace your existing drawHistogram)
const drawHistogram = (data) => {
    // clear previous
    d3.select("#histogram").selectAll("*").remove();
  
    // create svg and group
    const svg = d3.select("#histogram")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // --- safety: ensure numeric screenSize exists ---
    const validData = data.filter(d => typeof d.screenSize === "number" && !isNaN(d.screenSize));
    console.log("drawHistogram - total rows:", data.length, "valid screenSize rows:", validData.length);
  
    if (validData.length === 0) {
      svg.append("text")
        .attr("x", width/2)
        .attr("y", height/2)
        .attr("text-anchor", "middle")
        .text("No numeric screenSize data to display");
      return;
    }
  
    // --- create a binGenerator local copy with dynamic domain based on data ---
    const localBin = d3.bin()
      .value(d => d.screenSize)
      .domain(d3.extent(validData, d => d.screenSize))
      .thresholds(binGenerator.thresholds ? binGenerator.thresholds() : 15); // reuse thresholds if provided
  
    const bins = localBin(validData);
    console.log("Bins sample:", bins.slice(0,5));
    // each bin should have x0, x1 and length
  
    // defensive: remove any bins without x0/x1
    const cleanBins = bins.filter(b => typeof b.x0 === "number" && typeof b.x1 === "number");
  
    // --- scales ---
    const x = d3.scaleLinear()
      .domain([d3.min(cleanBins, d => d.x0), d3.max(cleanBins, d => d.x1)])
      .range([0, width]);
  
    const yMax = d3.max(cleanBins, d => d.length) || 1;
    const y = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height, 0]);
  
    // --- draw bars ---
    svg.selectAll("rect")
      .data(cleanBins)
      .enter()
      .append("rect")
      .attr("x", d => x(d.x0))
      .attr("y", d => y(d.length))
      .attr("width", d => {
        const w = x(d.x1) - x(d.x0) - 1;
        // if width NaN or negative, clamp to 0
        return (isFinite(w) && w > 0) ? w : 0;
      })
      .attr("height", d => height - y(d.length))
      .style("fill", "#69b3a2")
      .style("stroke", "#fff");
  
    // --- axes ---
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
  
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));
  
    // labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .text("Screen Size (cm)");
  
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .text("Number of TVs");
  };
  