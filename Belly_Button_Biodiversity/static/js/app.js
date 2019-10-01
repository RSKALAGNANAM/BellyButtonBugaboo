function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

    // RK Comment - Do CTRL+SHIFT+R to do a hard reset and empty the cache

    // RK comment - used the approach given in function init() to define a variable mySampleMetaData

    var mySampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata prior to populating in the d3 call below
    mySampleMetadata.html("");

    // Use d3 to select the panel with id of `#sample-metadata`
    // RK comment - use only the route; it needs to be in "ticks" or " ` " because we are using the ${}
    
    d3.json(`/metadata/${sample}`).then(function(myMetaData) {
      console.log(myMetaData);
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(myMetaData).forEach(function([key,value]) {
        console.log(key,value);
      // Storing the keys and values in the panel mySampleMetadata
        var myPTag = mySampleMetadata.append("p");
        myPTag.text(`${key}:${value}`);
      })


    console.log(myMetaData.WFREQ);
    
    // BONUS: Build the Gauge Chart
    //buildGauge(data.WFREQ)

   var myGauge = [
      {        
        domain: { x: [0, 9], y: [0, 9] },
        value: myMetaData.WFREQ,
        title: { text: "Speed" },
        type: "indicator",
        mode: "gauge+number"
      }
    ];

    var layoutGauge = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    // The word "gauge" below is the same as the "id" in the html file which is "gauge"

    Plotly.newPlot("gauge", myGauge, layoutGauge);

  });
};

function buildCharts(sample) {

    console.log(sample);

  // @TODO: Use `d3.json` to fetch the sample data for the plots and create the trace within the loop

     d3.json(`/samples/${sample}`).then(function(mySample) {

    // @TODO: Build a Bubble Chart using the sample data

     // RK Comment - Create tracer for the bubble chart

     var traceBubble = {
       x:mySample.otu_ids,
       y:mySample.sample_values,
       mode:"markers",
       text:mySample.otu_labels,
       marker: {
         colorscale: 'Earth',
         size:mySample.sample_values,
         color:mySample.otu_ids
       }
     };
     
    

      console.log(traceBubble);

      // RK Commnent - Create layout for the bubble chart

      var layoutBubble = {
        title: "BellyButton Bubble Chart",
        xaxis: {title: "Sample OTU ID"},
        yaxis: {title: "Sample Value"}
      };

      // RK Comment - define the bubble plot
      // The word "bubble" below is the same as the "id" in the html file which is "bubble"

      Plotly.plot("bubble",[traceBubble],layoutBubble);

          // @TODO: Build a Pie Chart
          // HINT: You will need to use slice() to grab the top 10 sample_values,
          // otu_ids, and labels (10 each).

      var tracePie = {
        // RK Comment - taking the top 10 sample values and corresponding otu_ids and otu_labels using slice
        hovertext:mySample.otu_labels.slice(0,10),
        values: mySample.sample_values.slice(0,10),
        labels: mySample.otu_ids.slice(0,10),
        type: 'pie'

      };

      var layoutPie = {
        height: 400,
        width: 500
      }

      // The word "pie" below is the same as the "id" in the html file which is "pie"

        Plotly.plot("pie",[tracePie],layoutPie);  

    });



}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
