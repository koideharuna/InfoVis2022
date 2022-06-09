var data_count = [];

class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
        }
        
        var counts = {};
        for(var i=0;i< data.length;i++){
          var key = data[i].EyeColor;
            console.log(data[i].EyeColor);
            counts[key] = (counts[key])? counts[key] + 1 : 1 ;
            data_count.push({color : key, value : counts[key]});
        }
        
        console.log(typeof(data),data);
        //console.log(typeof(data_count),data_count);
        
        this.data = data;
        this.init();
    }

    
    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        
        /*
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);
*/
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
        
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.svg.append('g')
            .append("text")
            .attr("x", self.config.margin.left + self.inner_width / 4 )
            .attr("y", self.config.margin.top)
            .attr("font-weight", "bold")
            .attr("font-size", "12pt")
            .text(self.config.xlabel);
        
    }

    
    update() {
        let self = this;
        self.render();
    }

    
    render() {
        let self = this;
        
        var radius = Math.min( self.config.width, self.config.height ) / 3;
        const pie = d3.pie()
            .value( d => d.value )
            .sort(null);

        const arc = d3.arc()
              .innerRadius(radius/3)
              .outerRadius(radius);
    
         self.chart.selectAll('pie')
            .data( pie(data_count) )
            .enter()
            .append('path')
            .attr('d', arc)
            .style('fill', function(d){ return d.data.color; })
            .attr("opacity", 0.6)
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
        
        self.chart.selectAll('.arc')
            .data( pie(data_count) )
            .enter()
            .append("g")
            .attr("class", "arc")
            .append('text')
            .attr('fill', 'b')
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.EyeColor; });
        
    }
    
}
