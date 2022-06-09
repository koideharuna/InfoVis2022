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
        
        //data_count:瞳の色ごとに分ける
        data_count.length = 0;
        var counts = {};
        for(var i=0;i<data.length;i++){
          var key = data[i].EyeColor;
            counts[key] = (counts[key])? counts[key] + 1 : 1 ;
            for(var j=0;j<data_count.length;j++){
                if(data_count[j].color==key)data_count.splice(j,1);
            }
            data_count.push({color : key, piecolor : key, value : counts[key]});
        }
        
        //色が多い順
        data_count = data_count.sort(function(a,b){return b.value - a.value;});
        
        data_count.shift();data_count.shift();
        data_count.shift();data_count.shift();
        data_count.shift();data_count.shift();
        data_count.shift();data_count.shift();
        data_count.shift();data_count.shift();
        data_count.shift();data_count.shift();
        data_count.shift();data_count.shift();
        data_count.shift();
        
        
        //色味定義のものは一番最後に
        //お会うチャート出力用色の名前　いくつか再定義
        for(var i=0;i<data_count.length;i++){
            if(data_count[i].color=="-"){
                data_count[i].piecolor="black"
                var noncolor = data_count[i];
                data_count.splice(i,1);
                data_count.push(noncolor);
                
                data_count.pop();
            }
            if(data_count[i].color=="hazel")data_count[i].piecolor="YellowGreen";
            if(data_count[i].color=="amber")data_count[i].piecolor="GoldenRod";
            if(data_count[i].color=="yellow (without irises)")data_count[i].piecolor="Khaki";
            if(data_count[i].color=="yellow / red")data_count[i].piecolor="Orange";
            if(data_count[i].color=="green / blue")data_count[i].piecolor="MediumSeaGreen";
            if(data_count[i].color=="blue / white")data_count[i].piecolor="PowderBlue";
            if(data_count[i].color=="white / red")data_count[i].piecolor="LightCoral";
            if(data_count[i].color=="yellow / blue")data_count[i].piecolor="LimeGreen";
        }
        console.log(data_count);
        this.data = data;
        this.init();
    }

    
    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        
        
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);
        
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.svg.append('g')
            .append("text")
            .attr("x", self.config.margin.left + self.inner_width / 4.5 )
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
        
        //var radius = Math.min( self.config.width, self.config.height ) / 3;
        var radius = 50 + 25*self.data.length/734;
        const pie = d3.pie()
            .value( d => d.value )
            .sort(null);

        const arc = d3.arc()
              .innerRadius(0)
              .outerRadius(radius);
    
         self.chart.selectAll('pie')
            .data( pie(data_count) )
            .enter()
            .append('path')
            .attr('d', arc)
            .style('fill', function(d){ return d.data.piecolor; })
            .attr("opacity", 0.8)
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
        
        self.chart.selectAll('pie')
        
        /*
        self.chart.selectAll('.arc')
            .data( pie(data_count) )
            .enter()
            .append("g")
            .attr("class", "arc")
            .append('text')
            .attr('fill', 'b')
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle") ;
           // .text(function(d) { return d.data.color; });
        */
        
        /*
        self.chart.selectAll("circle")
            .on('mouseover', function(e,d){
                d3.select('#tooltip')
                    .style("color",d.color)
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position
                            </div>(x,y)=(${d.x}, ${d.y})
                            <div class="tooltip-label">r
                            </div>${d.r}
                            <div class="tooltip-label">color
                            </div>${d.color}`)
                d3.select(this)
                        .style('opacity', 1);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
                self.chart.selectAll("circle")
                    .style('opacity', 0.5);
            });
        */
    }
    
}
