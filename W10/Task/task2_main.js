d3.csv("https://koideharuna.github.io/InfoVis2022/W04/w04_task1.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; d.r = +d.r; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:30, right:10, bottom:50, left:50},
            title: 'Sample Data',
            xlabel: 'X label',
            ylabel: 'Y label'
        };

        const scatterPlot = new ScatterPlot( config, data );
        scatterPlot.update();
        
    })
    .catch( error => {
        console.log( error );
    });
