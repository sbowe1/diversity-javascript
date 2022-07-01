// Dropdown menu
let dropdown = d3.select('#selDataset');
let data = d3.json('data/samples.json').then(data => {
    let names = data.names;
    names.forEach(name => {
        dropdown.append('option').text(name).property('value', name);
})});

// Horizontal bar chart with dropdown menu for top 10 OTUs found in that individual
function bar(sampleID) {
    let data = d3.json('data/samples.json').then(data => {
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
            width: '100%',
            height: '100%'
        };
    Plotly.newPlot('#bar', dataBar, layoutBar);
    })
}

// Demographics panel
function demographics(id) {
    let data = d3.json('data/samples.json').then(data => {
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
    let data = d3.json('data/samples.json').then(data => {
        let samples = data.samples;

        // Filter for specific sample ID
        let filterSample = samples.filter(sampleName => sampleName.id == sampleID)[0];
        let otuIDs = filterSample.otu_ids;
        let sampleValues = filterSample.sample_values;
        let otuLabels = filterSample.otu_labels;
        
        let dataBubble = [{
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIDs
            }
        }];
        let layoutBubble = {
            title: `ID ${sampleID}: OTUs by Value`,
            showlegend: false,
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Sample Value'},
            width: '100%',
            height: '100%'
        };
        Plotly.newPlot('#bubble', dataBubble, layoutBubble);
    });
}

// Initial
function init(choice) {
    demographics(choice);
    bar(choice);
    bubble(choice);
}

// Set initial set of graphs as ID 940
init(940);

// Update when changing dropdown ID
dropdown.on('change', init);
