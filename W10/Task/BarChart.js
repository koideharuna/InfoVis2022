class BarChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
        };
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
            .range([0, self.inner_width]) //画面上のpx範囲
            .paddingInner(0.3); //バー同士の間のpadding
        
        self.yscale = d3.scaleLinear()
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
         
        
        const title_space = 10;
        self.svg.append('text')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top - title_space)
            .text( self.config.title );

        const xlabel_space = 40;
        self.svg.append('text')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 50;
        self.svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }

    update(dataNew) {
        let self = this;

        const space = 10;
        const ymin = 0;
        const ymax = d3.max(dataNew, d => d.value) + space;
        self.yscale.domain([ymin, ymax]);
        
        const items = dataNew.map(d => d.label);
        self.xscale.domain(items);
        
        let padding = 10;
        let height = 20;

        self.chart.selectAll("rect")
            .data(dataNew)
            .transition()
            .duration(2000)
            .attr("x",d => self.xscale(d.label))
            .attr("y",d => self.yscale(d.value) )
            .attr("width", self.xscale.bandwidth() )
            .attr("height",d => self.inner_height - self.yscale(d.value) )
            .style("fill",function(d){ return d.color; });
        
        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x",d => self.xscale(d.label))
            .attr("y",d => self.yscale(d.value) )
            .attr("width", self.xscale.bandwidth() )
            .attr("height",d => self.inner_height - self.yscale(d.value) )
            .style("fill",function(d){ return d.color; });

        self.xaxis_group
            .call( self.xaxis );
        self.yaxis_group
            .call( self.yaxis );
    }
}

