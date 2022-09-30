

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
     
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  //  Create the buildCharts function.
  function buildCharts(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // Create a variable that holds the samples array. 
      console.log(data);
      var samplesArray = data.samples;
      console.log(samplesArray);
      // Create a variable that filters the samples for the object with the desired sample number.
      var selectedIdSamples = samplesArray.filter(data => data.id == sample);
      console.log(selectedIdSamples);
      // Create a variable that holds the first sample in the array.
      var firstSample = selectedIdSamples[0];
      console.log(firstSample);
  
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = firstSample.otu_ids;
      var otuLabels = firstSample.otu_labels;
      var sampleValues = firstSample.sample_values;
      console.log(otuIds);
      console.log(otuLabels);
      console.log(sampleValues);
  
      // Create the yticks for the bar chart.
        
      var yticks = otuIds.slice(0,10).map(id => "OTU " + id).reverse();
      console.log(yticks);
      
      // Create the trace for the bar chart. 
      var barData = [{
        x: sampleValues.slice(0,10).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        type: "bar"
      }];
      // Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        yaxis: {
          tickmode: "array",
          tickvals: [0,1,2,3,4,5,6,7,8,9],
          ticktext: yticks
        },
        annotations: [{
          xref: 'paper',
          yref: 'paper',
          x: 0.5,
          xanchor: 'center',
          y: -0.25,
          yanchor: 'center',
          text: 'The bar chart displays the top 10 bacterial species (OTUs)<br>with the number of samples found in your belly button',
          showarrow: false
        }]
      };
     
      // Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout, {responsive: true});
  
      // Bar and Bubble charts
       
      // Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth"
        }
      }];
      console.log(bubbleData);
      // Create the layout for the bubble chart.
      var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        showlegend: false,
        xaxis: {title: "OTU ID", automargin: true},
        yaxis: {automargin: true},
        hovermode: "closest"
      };
      console.log(bubbleLayout);
  
      // Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});
  
      // Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata_SelId = data.metadata.filter(data => data.id == sample);
      console.log(metadata_SelId);  
  
      // Create a variable that holds the washing frequency.
      var washFreq = +metadata_SelId[0].wfreq;
      
      // Create the trace for the gauge chart.
      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washFreq,
          title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {
              range: [null, 10],
              tickmode: "array",
              tickvals: [0,1,2,3,4,5,6,7,8,9,10],
              ticktext: [0,1,2,3,4,5,6,7,8,9,10]
            },
            bar: {color: "grey"},
            steps: [
              { range: [0, 1], color: "#e3ddd8" },
              { range: [1, 2], color: "#e3d3d8" },
              { range: [2, 3], color: "#dfe5cc" },
              { range: [3, 4], color: "#dfe5bf" },
              { range: [4, 5], color: "#dfe5b3" },
              { range: [5, 6], color: "#dfe5a3" },
              { range: [6, 7], color: "#dfe595" },
              { range: [7, 8], color: "#dfe567" },
              { range: [8, 9], color: "#dbdd1d" },
              { range: [8, 9], color: "#63b152" },
              { range: [9,10], color: "#2ab152" }
            ]
          }
        }
      ];
      
      // Create the layout for the gauge chart.
      var gaugeLayout = { 
        autosize: true,
        annotations: [{
          xref: 'paper',
          yref: 'paper',
          x: 0.5,
          xanchor: 'center',
          y: 0,
          yanchor: 'center',
          text: "The gauge displays your belly button weekly washing frequency",
          showarrow: false
        }]
      };
  
      // Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
    });
  }