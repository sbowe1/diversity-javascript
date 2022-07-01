// Dropdown menu
let dropdown = d3.select('#selDataset');
let data = d3.json('data/samples.json').then(data => {
    let names = data.names;
    names.forEach(name => {
        dropdown.append('option').text(name).property('value', name);
})});


// Horizontal bar chart with dropdown menu for top 10 OTUs found in that individual
function bar(sampleID) {
    d3.json('data/samples.json').then(data => {
        let samples = data.samples;
        
        // Filter for specific sample ID
        let filterSample = samples.filter(sampleName => sampleName.id == sampleID)[0];
        let otuIDs = filterSample.otu_ids;
        let sampleValues = filterSample.sample_values;
        let otuLabels = filterSample.otu_labels;
        
        let dataBar = [{
            // Top 10 OTU IDs
            y: otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: sampleValues.slice(0, 10).reverse(),
            text: otuLabels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];
        let layoutBar = {
            title: `ID ${sampleID}: Top 10 OTUs`,
            showlegend: false,
            xaxis: {title: 'Sample Value'},
            yaxis: {title: 'OTU ID'},
            height: '100%'
        };
    Plotly.newPlot('bar', dataBar, layoutBar);
    });
}

// Demographics panel
function demographics(id) {
    d3.json('data/samples.json').then(data => {
        let metadata = data.metadata;
        let panel = d3.select('#demographics');
        let filtered = metadata.filter(sampleName => sampleName.id == id)[0];
        Object.entries(filtered).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        });
    });
}

// Bubble chart
function bubble(sampleID) {
    d3.json('data/samples.json').then(data => {
        let samples = data.samples;

        // Filter for specific sample ID
        let filterSample = samples.filter(sampleName => sampleName.id == sampleID)[0];
        let otuIDs = filterSample.otu_ids;
        let sampleValues = filterSample.sample_values;
        let otuLabels = filterSample.otu_labels;
        
        let dataBubble = [{
            x: otuIDs.slice(0,10).map(otuID => otuID).reverse(),
            y: sampleValues.slice(0, 10).reverse(),
            text: otuLabels.slice(0, 10).reverse(),
            mode: 'markers',
            marker: {
                size: sampleValues.slice(0, 10).reverse(),
                color: otuIDs.slice(0, 10).reverse()
            }
        }];
        let layoutBubble = {
            title: `ID ${sampleID}: OTUs by Value`,
            showlegend: false,
            xaxis: {
                title: 'OTU ID',
                rangemode: 'tozero',
                autorange: true
            },
            yaxis: {
                title: 'Sample Value',
                rangemode: 'tozero',
                autorange: true
            },
            width: '100%',
            height: '100%'
        };
        Plotly.newPlot('bubble', dataBubble, layoutBubble);
    });
}

// Gauge
function gauge(sampleID) {
    d3.json('data/samples.json').then(data => {
        let metadata = data.metadata;

        let filterMeta = metadata.filter(sampleName => sampleName.id == sampleID)[0];

        let dataGauge = [{
            domain: {x: [0, 1], y: [0, 1]},
            value: filterMeta.wfreq,
            gauge: {
                steps: [
                    {range: [0, 1], text: '0-1'},
                    {range: [1, 2], text: '1-2'},
                    {range: [2, 3], text: '2-3'},
                    {range: [3, 4], text: '3-4'},
                    {range: [4, 5], text: '4-5'},
                    {range: [5, 6], text: '5-6'},
                    {range: [6, 7], text: '6-7'},
                    {range: [7, 8], text: '7-8'},
                    {range: [8, 9], text: '8-9'}, 
                ]
            },
            type: 'indicator',
            mode: 'gauge'
        }];
        let layout = {
            title: 'Scrubs per Week',
            height: '100%'
        };
        Plotly.newPlot('gauge', dataGauge, layout);
    })
}

// Initial
function init(choice) {
    demographics(choice);
    bar(choice);
    gauge(choice);
    bubble(choice);
}

// Set initial set of graphs as ID 940
init(940);

// Update function
function update(choice) {
    // Reset panel text so only one ID's info is showing at once
    let panel = d3.select('#demographics');
    panel.text(' ')

    demographics(choice);
    bar(choice);
    gauge(choice);
    bubble(choice);
}

// Update when changing dropdown ID
dropdown.on('change', update);

