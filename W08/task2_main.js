 d3.csv("https://koideharuna.github.io/InfoVis2022/W08/task2_data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:50, right:10, bottom:50, left:50}
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

        
        self.xscale =  d3.scaleBand()
            .domain(self.data.map( d => d.label)) //値の範囲
            .range([3, self.inner_width]) //画面上のpx範囲
            .paddingInner(0.3); //バー同士の間のpadding
        
        self.yscale = d3.scaleLinear()
            .domain([0,d3.max(self.data, d => d.value)]) //値の範囲
            .range([self.inner_height,0]); //画面上のpx範囲
        
        
        self.xaxis = d3.axisBottom( self.xscale ) //底辺に軸
                .tickSizeOuter(0); //外側のメモリサイズ，０＞外側のメモリ無くす
        self.xaxis_group = self.chart.append('g')
                .attr('transform', `translate(0, ${self.inner_height})`)
                .call( self.xaxis );
        
        
        self.yaxis = d3.axisLeft( self.yscale )
                .ticks(5) //メモリの感覚，メモリの数
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
            .attr("x", -self.config.height/2 )
            .attr("y", self.config.margin.left/5 )
            .attr("font-weight", 300)
            .attr("font-size", "11pt")
            .attr("transform", "rotate(-90)")
            .text("Y-label");
    }

    
    update() {
        let self = this;
        self.render();
    }

    
    render() {
        let self = this;

        const line = d3.line()
              .x( d => d.x )
              .y( d => d.y );
        
        self.svg.append('path')
            .attr('d', line(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'none');
        
        
        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
    
}
