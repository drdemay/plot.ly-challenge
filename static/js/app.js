// Overall, need to populate the IDs, so then they can be selected to create the graphs

// First thing, initialize the code to create the dashboard - Create an initialization function
function initDashboard() {
    console.log("Initializing Screen");
 
    // The Initialize function needs to do the following:
        // Populate the dropdown box with all the IDs - create variable to select the dropdown
        var selector = d3.select("#selDataset");

        // Read json file with data, then populate the dropdown using the key from  the data (names in this case)
        d3.json("samples.json").then((data) => {
            var sampleNames = data.names;

        // For each sample, use the value from the key to populate the contents of the dropdown box -
        // append an option to it, set text to it and assign a property
            sampleNames.forEach((sampleID) => { 
                selector
                    .append("option") 
                    .text(sampleID)
                    .property("value", sampleID); 
            });
    
            var sampleID = sampleNames[0];

            // Populate Demographic Information
            showDemographicInfo(sampleID);
            // Draw bargraph
            drawBarGraph(sampleID);
            // // Draw bubble chart
            drawBubbleChart(sampleID);

        });

    }

// create a function to get new data and create corresponding demographic information, bar graph, and bubble chart for the sample selected
function optionChanged(newSampleID) {
     showDemographicInfo(newSampleID); 
     drawBarGraph(newSampleID);
     drawBubbleChart(newSampleID); 

     console.log("Dropdown changed to:", newSampleID);
}
 
// // create a function to show the demographic information
function showDemographicInfo(selectedSampleID) {

    console.log("showDemographicInfo: sample =", selectedSampleID);

    d3.json("samples.json").then((data) => {

    var demographicInfo = data.metadata;

    var resultArray = demographicInfo.filter(sampleObj => sampleObj.id == selectedSampleID)
    var result = resultArray[0];
    console.log(result)

    var panel = d3.select("#sample-metadata");
    // clear panel variable on every load
    panel.html("");

        Object.entries(result).forEach(([key, value]) => {
            var labelsToShow = `${key}: ${value}`;
            panel.append("h6").text(labelsToShow);
        });
    });

}
// create a function to draw the bar graph
function drawBarGraph(selectedSampleID) { 
    console.log("drawBarGraph: sample = ", selectedSampleID);

    // Create barData and assign values to specify x values, y values, type, orientation
    // Filter the json on samples to get data out of it (in the sample there is an id, otu_ids, sample values, labels)
    // Locate the ID that was selected
    // Display the results for that ID - ids, labels, sample values
    d3.json("samples.json").then((data) => {
  
        var sampleBacteria = data.samples;
        
        var resultArray = sampleBacteria.filter(sampleObj => sampleObj.id == selectedSampleID);
        var result = resultArray[0];
        console.log(result)

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
    
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        var barData = [
            {
                x: sample_values.slice(0, 10).reverse(),
                y: yticks,
                type: "bar",
                text:  otu_labels.slice(0, 10).reverse(),
                orientation: "h" 
            }
        ];
 
        // Create barLayout and assign values to specify x values, y values, type, orientation
        var barLayout = {
            title: "Top Ten Bacteria Cultures Found",
            margin: {t: 30, l: 100}
        };
   
    // Use Plotly to draw the bar graph, use div to determine where this plot should be drawn and provide it with some data
    Plotly.newPlot("bar", barData, barLayout);

    });
}

// create a function to draw the bubble chart
function drawBubbleChart(selectedSampleID) {
    console.log("drawBubbleChart: sample = ", selectedSampleID);

    d3.json("samples.json").then((data) => {
  
        var sampleBacteria = data.samples;
        
        var resultArray = sampleBacteria.filter(sampleObj => sampleObj.id == selectedSampleID);
        var result = resultArray[0];
        console.log(result)

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Bluered"
                }
            }
        ];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 30, l: 100},
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Number of Bacteria"}
        };
    


// Use Plotly to draw the bubble graph, use div to determine where this plot should be drawn and provide it with some data
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);    
});

}

initDashboard();