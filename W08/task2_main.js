 d3.csv("https://koideharuna.github.io/InfoVis2022/W08/task2_data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:50, right:10, bottom:50, left:50}
        };

        const linechart = new LineChart( config, data );
        linechart.update();
    })
    .catch( error => {
        console.log( error );
    });


class LineChart {

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

    
        const space = 10;
        self.xscale =  d3.scaleLinear()
            .domain([d3.min(self.data, d => d.x)-space,
                     d3.max(self.data, d => d.x)+space]) //値の範囲
            .range([0, self.inner_width]); //画面上のpx範囲
        
        self.yscale = d3.scaleLinear()
            .domain([d3.max(self.data, d => d.y)+space,
                     d3.min(self.data, d => d.y)-space]) //値の範囲
            .range([0,self.inner_height]); //画面上のpx範囲
        
        self.xaxis = d3.axisBottom( self.xscale ) //底辺に軸
                .ticks(5);
        self.xaxis_group = self.chart.append('g')
                .attr('transform', `translate(0, ${self.inner_height})`)
                .call( self.xaxis );
        
        
        self.yaxis = d3.axisLeft( self.yscale )
                .ticks(5) //メモリの感覚，メモリの数
        self.yaxis_group = self.chart.append('g')
                .call( self.yaxis );
         

        self.svg.append('g')
            .append("text")
            .attr("x", self.config.margin.left + self.inner_width / 4 )
            .attr("y", self.config.margin.top/2)
            .attr("font-weight", "bold")
            .attr("font-size", "12pt")
            .text("LineChart");
        
        self.svg.append('g')
            .append("text")
            .attr("x", -self.config.height/2 )
            .attr("y", self.config.margin.left/5 )
            .attr("font-weight", 300)
            .attr("font-size", "11pt")
            .attr("transform", "rotate(-90)")
            .text("Y-label");
        
        self.svg.append('g')
            .append("text")
            .attr("x", (self.config.margin.left + self.inner_width) / 2)
            .attr("y", self.config.height - self.config.margin.bottom/5 )
            .attr("font-weight", 300)
            .attr("font-size", "11pt")
            .text("X-label");
        
    }

    
    update() {
        let self = this;
        self.render();
    }

    
    render() {
        let self = this;
        
        const line = d3.line()
            .x( d => self.xscale(d.x) )
            .y( d => self.inner_height -self.yscale(d.y) );

        const area = d3.area()
            .x( d => self.xscale(d.x) )
            .y1( d => self.inner_height -self.yscale(d.y) )
            .y0( self.inner_height  );
        

        self.chart.append('path')
            .attr('d', area(self.data))
            .attr('stroke', 'none')
            .attr('fill', d3.interpolateReds(0.1));


        self.chart.append('path')
            .attr('d', line(self.data))
            .attr('stroke', d3.interpolateReds(0.6))
            .attr('fill', 'none')
            .attr("stroke-width", 2);
        
        
        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.inner_height - self.yscale( d.y ) )
            .attr("r", 3 );
        
        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
    
}
