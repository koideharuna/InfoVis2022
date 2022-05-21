d3.csv("https://koideharuna.github.io/InfoVis2022/W04/w04_task2.csv")
    .then( data => {
        data.forEach( d => { d.value = +d.width;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:50, right:10, bottom:50, left:50},
            title: 'Sample Data',
            xlabel: 'Label',    //'Value'
            ylabel: 'Value'     //'Label'
        };

        const barchart = new BarChart( config, data );
        barchart.update(data);
        
        const data_original = data.slice()
        
        d3.select('#reset')
            .on('click', d => {
                barchart.update(data_original);
            });
        
        d3.select('#reverse')
            .on('click', d => {
                data.reverse();
                barchart.update(data);
            });
        
        d3.select('#descend')
            .on('click', d => {
                data.sort(function (a, b) {
                  return a.value - b.value;
                });
                data.reverse();
                barchart.update(data);
            });
        
        d3.select('#ascend')
            .on('click', d => {
                data.sort(function (a, b) {
                  return a.value - b.value;
                });
                barchart.update(data);
            });
        
    })
    .catch( error => {
        console.log( error );
    });
