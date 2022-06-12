var data_count = [];

class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
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
            data_count.push({color : key, piecolor : key, labelcolor : key, value : counts[key]});
        }
        
        //色が多い順
        data_count = data_count.sort(function(a,b){return b.value - a.value;});
        
        //色が未定義のものは一番最後に
        //パイチャート出力用色の名前　いくつか変更
        //パイチャートのラベル用色の名前　いくつか変更
        for(var i=0;i<data_count.length;i++){
            if(data_count[i].color=="-"){
                data_count[i].piecolor="WhiteSmoke";
                data_count[i].labelcolor="gray";
                data_count[i].color="unknown";
                var noncolor = data_count[i];
                data_count.splice(i,1);
                data_count.push(noncolor);}
            if(data_count[i].color=="white")data_count[i].labelcolor="gray";
            if(data_count[i].color=="yellow")data_count[i].labelcolor="GoldenRod";
            if(data_count[i].color=="hazel"){
                data_count[i].piecolor="YellowGreen";
                data_count[i].labelcolor="YellowGreen";}
            if(data_count[i].color=="amber"){
                data_count[i].piecolor="GoldenRod";
                data_count[i].labelcolor="GoldenRod";}
            if(data_count[i].color=="yellow (without irises)"){
                data_count[i].piecolor="Khaki";
                data_count[i].labelcolor="Khaki";}
            if(data_count[i].color=="yellow / red"){
                data_count[i].piecolor="Orange";
                data_count[i].labelcolor="Orange";}
            if(data_count[i].color=="green / blue"){
                data_count[i].piecolor="MediumSeaGreen";
                data_count[i].labelcolor="MediumSeaGreen";}
            if(data_count[i].color=="blue / white"){
                data_count[i].piecolor="PowderBlue";
                data_count[i].labelcolor="PowderBlue";}
            if(data_count[i].color=="white / red"){
                data_count[i].piecolor="LightCoral";
                data_count[i].labelcolor="LightCoral";}
            if(data_count[i].color=="yellow / blue"){
                data_count[i].piecolor="LimeGreen";
                data_count[i].labelcolor="LimeGreen";}
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
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);
        
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
        
        self.svg.append('g')
            .append("text")
            .attr('transform', `translate(${self.config.width/2 - 25}, ${self.config.height/2 - 5})`)
            .attr("font-size", "10pt")
            .text("data size");
        
        self.svg.append('g')
            .append("text")
            .attr('transform', `translate(${self.config.width/2 - 15}, ${self.config.height/2 + 15})`)
            .attr("font-size", "14pt")
            .text(self.data.length);
    }

    
    update() {
        let self = this;
        self.render();
    }

    
    render() {
        let self = this;
        
        var radius = 80 + 25*self.data.length/734;
        const pie = d3.pie()
            .value( d => d.value )
            .sort(null);

        const arc = d3.arc()
              .innerRadius(30)
              .outerRadius(radius);
        
        var arcOver = d3.arc()
                .innerRadius(30)
                .outerRadius(radius + 15);
        
        var arcMajor = d3.arc()
            .innerRadius(30)
            .outerRadius(function (d) {
                return radius ;
            })
        
         self.chart.selectAll('pie')
            .data( pie(data_count) )
            .enter()
            .append('path')
            .attr('d', arc)
            .style('fill', function(d){ return d.data.piecolor; })
            .style('opacity', 0.7)
            .attr('stroke', 'black')
            .style('stroke-width', '0.03px')
            .on("mouseover", function(e,d) {
              d3.select("#tooltip")
                .style("color",d.data.labelcolor)
                .style('opacity', 1)
                .html(`<div class="tooltip-label">Eye Color
                        </div>${d.data.color}
                        <div class="tooltip-label">ratio
                        </div>${(d.data.value/self.data.length*100).toFixed(2)}%
                        <div class="tooltip-label">Quantity
                        </div>${d.data.value}
                        `);
              d3.select(this)
                .style('opacity', 1)
                .attr("stroke","white")
                .transition()
                .duration(1000)
                .attr("d", arcOver)
                .attr("stroke-width",6);
            })
            .on('mousemove', (e) => {
                const padding = 10;
              d3.select('#tooltip')
                .style('left', (e.pageX + padding) + 'px')
                .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', function(e,d) {
              d3.select('#tooltip')
                .style('opacity', 0);
              d3.select(this)
                .transition()
                .attr("d", arcMajor)
                .attr("stroke","none")
                .style('opacity', 0.7);
            })
            .on('click', function(ev,d) {
                filter_data.length = 0;
                filter_data = self.data.filter(a => a.EyeColor == d.data.color);
                Filter();
        });
    }
 
    
}
