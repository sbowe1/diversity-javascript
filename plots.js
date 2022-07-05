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

        console.log(filterMeta.wfreq);

        let degrees = -180 - (180/9)*filterMeta.wfreq; radius = 0.225;
        let radians = degrees * Math.PI/180;
        let x = radius * Math.cos(radians) + 0.5;
        let y = radius * Math.sin(radians) + 0.5;

        let dataGauge = [{
            type: 'pie',
            showlegend: false,
            hole: 0.4,
            rotation: 90,
            values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
            direction: 'clockwise',
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: ['#ffffff', '#ddf9e6', '#bbf3cd', '#99edb5', '#76e89c', '#54e283', '#32dc6a', '#22c457', '#1ca248', 'white']
            },
            labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
            hoverinfo: 'none'
        }];
    
        let layout = {
            shapes: [{
                type: 'line',
                x0: 0.5,
                y0: 0.5,
                x1: x, 
                y1: y,
                line: {
                    color: 'red', 
                    width: 4
                },
            }],
            title: 'Scrubs per Week',
            xaxis: {visible: true},
            yaxis: {visible: true}
        };

        Plotly.newPlot('gauge', dataGauge, layout);
    });
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
