let input_data;
let scatter_plot;
let bar_chart;
let filter_data = [];

d3.csv("https://koideharuna.github.io/InfoVis2022/FinalTask/heroes_information.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.Height = +d.Height;
            d.Weight = +d.Weight;
        });

        pie_chart = new PieChart( {
            parent: '#drawing_region_piechart',
            width: 400,
            height: 250,
            margin: {top:20, right:25, bottom:50, left:80}
        }, input_data );
        pie_chart.update();
        
        pie_chart_good = new PieChart( {
            parent: '#drawing_region_piechart_good',
            width: 300,
            height: 220,
            margin: {top:20, right:20, bottom:50, left:50}
        }, input_data.filter(d => d.Alignment == "good") );
        pie_chart_good.update();
        
        pie_chart_bad = new PieChart( {
            parent: '#drawing_region_piechart_bad',
            width: 300,
            height: 220,
            margin: {top:20, right:20, bottom:50, left:50}
        }, input_data.filter(d => d.Alignment == "bad") );
        pie_chart_bad.update();
        
        pie_chart_neutral = new PieChart( {
            parent: '#drawing_region_piechart_neutral',
            width: 300,
            height: 220,
            margin: {top:20, right:20, bottom:50, left:50}
        }, input_data.filter(d => d.Alignment == "neutral") );
        pie_chart_neutral.update();

        circle_plot = new Circle( {
            parent: '#drawing_region_circle',
            width: 1300,
            height: 300,
            margin: {top:20, right:10, bottom:50, left:10},
        }, input_data );
        circle_plot.update(input_data);
        
        d3.select('#all')
            .on('click', d => {
                circle_plot.update(input_data);
            });
        d3.select('#good')
            .on('click', d => {
                circle_plot.update(input_data.filter(d => d.Alignment == "good"));
            });
        d3.select('#bad')
            .on('click', d => {
                circle_plot.update(input_data.filter(d => d.Alignment == "bad"));
        });
        d3.select('#neutral')
            .on('click', d => {
                circle_plot.update(input_data.filter(d => d.Alignment == "neutral"));
        });
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter_data.length == 0 ) circle_plot.data = input_data;
    else circle_plot.data = filter_data;
    circle_plot.update(filter_data);
}
