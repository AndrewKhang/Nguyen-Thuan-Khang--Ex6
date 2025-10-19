
// Main function to load data
function loadData() {
    // Load the CSV file using d3.csv()
    d3.csv("data/Ex6_TVdata.csv",d => ({
      // Convert numeric fields to numbers
      brand: d.brand?.trim(),
      model: d.model?.trim(),
      screenTech: d.screenTech?.trim(),
      screenSize: +d.screenSize,
      energyConsumption: +d.energyConsumption,
      star: +d.star
      })).then(data => {
        console.log("Columns in CSV:", data.columns);
        console.log("Example row:", data[0]);
      console.log("Data loaded:", data); // for debugging
  
      // Call the functions that will use this data
      populateFilters(data);    // Build buttons or filters
      drawHistogram(data);      // Draw the histogram chart 
      drawScatterplot(data);
       const tooltip = createTooltipScatter();
       handleScatterEvents(tooltip);

    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
  }
  document.addEventListener("DOMContentLoaded", loadData);

  
  