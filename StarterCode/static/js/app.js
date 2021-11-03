
function DropMenu() {
    d3.json('samples.json').then((data) => {
        console.log(data);
        
        let dropMenu = d3.select('#selDataset');
        let sample = data.names;
        sample.forEach((id) => {
            dropMenu
            .append("option")
            .text(id)
            .property("value", id);      
        });

        let default_id = sample[0]
        demo(default_id)
        charts(default_id)
    })
}

function charts(id) {
    d3.json('samples.json').then((data) => {
        let samples = data.samples
        let filter = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(filter)
        
        let otu_id = []
        let sample_value = []
        let sample_label = []
        for (let i=0; i<filter.otu_labels.length; i++) {
                otu_id.push(filter.otu_ids[i]),
                sample_value.push(filter.sample_values[i]),
                sample_label.push(filter.otu_labels[i])
        }
        console.log(sample_value)
        
        let trace_1 = {
            x: sample_value.slice(0,10).reverse(),
            y: otu_id.slice(0,10).map(x => `OTU ${x}`).reverse(),
            type: 'bar',
            text: sample_label,
            orientation: 'h',
        };

        let data_1 = [trace_1]

        let layout_1 = {
            title: `The Top 10 OTUs in Subject ${id} Belly Button`
        }

        Plotly.newPlot('bar', data_1, layout_1)

        let trace_2 = {
            x: otu_id,
            y: sample_value,
            mode: 'markers',
            text: sample_label,
            marker: {
                color: otu_id,
                size: sample_value
              }

        }

        let data_2 = [trace_2]

        let layout_2 = {
            title: `All OTUs found in Subject ${id}`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "OTU Value"},
            showlegend: false,
            
        }

        Plotly.newPlot('bubble', data_2, layout_2);

        
    });
}

function demo(id) {
    d3.json('samples.json').then((data) => {
        let metadata = data.metadata;
        let demo_box = d3.select("#sample-metadata");
        var result = metadata.filter(x => x.id.toString() === id)[0];
        demo_box.html("");
        Object.entries(result).forEach(([a, b]) => {
            demo_box.append("h6").text(`${a}:${b}`);
        })
    })
}

function optionChanged(sample) {
    demo(sample);
    charts(sample)
}

DropMenu()
