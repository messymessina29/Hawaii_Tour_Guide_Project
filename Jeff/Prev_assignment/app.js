// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(function(object) {
      return object.id == sample;
    });

    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataDisplay = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    metadataDisplay.html("");

    // Append new tags for each key-value in the filtered metadata
    for (var key in result) {
      metadataDisplay.append("p").text(`${key}: ${result[key]}`);
    }
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleArray = samples.filter(function(object) {
      return object.id == sample;
    });

    let sampleData = sampleArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // Render the Bubble Chart
    let bubbleLayout = {
      title: "OTU Samples",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest",
      margin: { t: 30 }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Combine the otu_ids, sample_values, and otu_labels into an array of objects
    let sortedData = [];
    for (let i = 0; i < sampleData.otu_ids.length; i++) {
      sortedData.push({
        otu_id: sampleData.otu_ids[i],
        sample_value: sampleData.sample_values[i],
        otu_label: sampleData.otu_labels[i]
      });
    }

    // Sort the array by sample values in descending order
    sortedData.sort(function compareFunction(a, b) {
      return b.sample_value - a.sample_value;
    });

    // Slice the first 10 elements of the sorted array
    let top10Data = sortedData.slice(0, 10).reverse();

    // Extract the otu_ids, sample_values, and otu_labels from the sorted and sliced array
    let top10_otu_ids = top10Data.map(item => item.otu_id);
    let top10_sample_values = top10Data.map(item => item.sample_value);
    let top10_otu_labels = top10Data.map(item => item.otu_label);

    // Map OTU IDs to strings for the y-axis ticks
    let yticks = top10_otu_ids.map(function(otuID) {
      return `OTU ${otuID}`;
    });

    // Build a Bar Chart
    let barData = [{
      x: top10_sample_values,
      y: yticks,
      text: top10_otu_labels,
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select('#selDataset')

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample)
    });


    // Get the first sample from the list
    let firstSample = sampleNames[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
