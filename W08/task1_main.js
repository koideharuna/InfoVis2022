d3.csv("https://koideharuna.github.io/InfoVis2022/W04/w04_task2.csv")
    .then( data => {
        data.forEach( d => { d.width = +d.width;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:30, right:10, bottom:50, left:50}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        /*
         //W6-task2
        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );
         */
        self.xscale = d3.scaleLinear()
             .domain([0, d3.max(data, d => d.width)])
             .range([0, self.inner_width]);
        
        self.yscale = d3.scaleBand()
              .domain(data.map(d => d.label))
              .range([0, self.inner_height])
              .paddingInner(0.1);
        
        /*
        const rmax = d3.max( self.data, d => d.r );
        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        */
        
        /* //W6-task2
        self.xaxis = d3.axisBottom( self.xscale )
            .tickValues([ xmin - rmax , xmax + rmax ])
            .tickSize(3)
            .tickPadding([10]);
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0 , ${self.inner_height})`);
        */
        self.xaxis = d3.axisBottom( self.xscale )
               .ticks(5)
               .tickSizeOuter(0);
        self.xaxis_group = self.chart.append('g')
               .attr('transform', `translate(0, ${self.inner_height})`)
               .call( self.xaxis );
         
        /* //W6-task2
        self.yaxis = d3.axisLeft( self.yscale )
            .tickValues([ ymin - rmax , ymax + rmax ])
            .tickSize(3)
            .tickPadding([10]);
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);
         */
        self.yaxis = d3.axisLeft( self.yscale )
                .tickSizeOuter(0);
        self.yaxis_group = self.chart.append('g')
            .call( self.yaxis );
         
         
        self.svg.append('g')
            .append("text")
            .attr("x", self.config.margin.left + self.inner_width / 3 )
            .attr("y", self.config.margin.top/2)
            .attr("font-weight", "bold")
            .attr("font-size", "12pt")
            .text("Chart Title");
        
        
        self.svg.append('g')
            .append("text")
            .attr("x", (self.config.margin.left + self.inner_width) / 2)
            .attr("y", self.config.height - self.config.margin.bottom/5 )
            .attr("font-weight", 300)
            .attr("font-size", "11pt")
            .text("X-label");
        
        self.svg.append('g')
            .append("text")
            .attr("x", -self.config.height/2 )
            .attr("y", self.config.margin.left/5 )
            .attr("font-weight", 300)
            .attr("font-size", "11pt")
            .attr("transform", "rotate(-90)")
            .text("Y-label");
    }

    update() {
        let self = this;
        
        /*
        const rmax = d3.max( self.data, d => d.r );

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin - rmax, xmax + rmax] );
                    
        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymin - rmax, ymax + rmax] );
        */
        self.render();
    }

    render() {
        let self = this;

        /*
        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .style("fill",function(d){ return d.color; });
         */
        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.width))
            .attr("height", self.yscale.bandwidth());

        
        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
}
