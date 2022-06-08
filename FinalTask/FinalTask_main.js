let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

d3.csv("https://koideharuna.github.io/InfoVis2022/FinalTask/heroes_information.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.Height = +d.Height;
            d.Weight = +d.Weight;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['setosa','versicolor','virginica']);

        pie_chart = new PieChart( {
            parent: '#drawing_region_piechart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            title: 'Eye color',
            xlabel: 'All',
            //cscale: color_scale
        }, input_data );
        pie_chart.update();
        
        pie_chart_good = new PieChart( {
            parent: '#drawing_region_piechart_good',
            width: 100,
            height: 100,
            margin: {top:5, right:5, bottom:25, left:25},
            xlabel: 'good',
            //cscale: color_scale
        }, input_data );
        pie_chart_good.update();
        
        pie_chart_bad = new PieChart( {
            parent: '#drawing_region_piechart_bad',
            width: 100,
            height: 100,
            margin: {top:5, right:5, bottom:25, left:25},
            xlabel: 'bad',
            //cscale: color_scale
        }, input_data );
        pie_chart_bad.update();
        
        pie_chart_neutral = new PieChart( {
            parent: '#drawing_region_piechart_neutral',
            width: 100,
            height: 100,
            margin: {top:5, right:5, bottom:25, left:25},
            xlabel: 'neutral',
            //cscale: color_scale
        }, input_data );
        pie_chart_neutral.update();
        
        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 300,
            height: 300,
            margin: {top:20, right:20, bottom:50, left:50},
            xlabel: 'Height [cm]',
            ylabel: 'Weight [kg]',
            //cscale: color_scale
        }, input_data );
        scatter_plot.update();

    })
    .catch( error => {
        console.log( error );
    });

/*
function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot.update();
}
*/
