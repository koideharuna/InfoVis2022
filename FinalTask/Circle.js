var group = [];


class Circle {

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
    }

    
    update(data_new) {
        
        let self = this;
        self.chart.selectAll("*").remove();
        self.data=data_new;
        group.length=0;
        
        //色味定義のもの変更
        for(var i=0;i<self.data.length;i++){
            self.data[i].piecolor=self.data[i].EyeColor;
            self.data[i].labelcolor=self.data[i].EyeColor;
            if(self.data[i].piecolor=="-"||self.data[i].piecolor=="unknown"){
                self.data[i].piecolor="WhiteSmoke";
                self.data[i].labelcolor="gray";
                self.data[i].EyeColor="unknown";}
            if(self.data[i].labelcolor=="white")self.data[i].labelcolor="gray";
            if(self.data[i].labelcolor=="yellow")self.data[i].labelcolor="GoldenRod";
            if(self.data[i].piecolor=="hazel"){
                self.data[i].piecolor="YellowGreen";
                self.data[i].labelcolor="YellowGreen";}
            if(self.data[i].piecolor=="amber"){
                self.data[i].piecolor="GoldenRod";
                self.data[i].labelcolor="GoldenRod";}
            if(self.data[i].piecolor=="yellow (without irises)"){
                self.data[i].piecolor="Khaki";
                self.data[i].labelcolor="Khaki";}
            if(self.data[i].piecolor=="yellow / red"){
                self.data[i].piecolor="Orange";
                self.data[i].labelcolor="Orange";}
            if(self.data[i].piecolor=="green / blue"){
                self.data[i].piecolor="MediumSeaGreen";
                self.data[i].labelcolor="MediumSeaGreen";}
            if(self.data[i].piecolor=="blue / white"){
                self.data[i].piecolor="PowderBlue";
                self.data[i].labelcolor="PowderBlue";}
            if(self.data[i].piecolor=="white / red"){
                self.data[i].piecolor="LightCoral";
                self.data[i].labelcolor="LightCoral";}
            if(self.data[i].piecolor=="yellow / blue"){
                self.data[i].piecolor="LimeGreen";
                self.data[i].labelcolor="LimeGreen";}
        }
        
        //Publisherごとにグループを設定
        //グループ（Publisher）ごとの人数カウント
        var k = 0;
        var counts = {};
        for(var i=0;i<self.data.length;i++){
            var key = self.data[i].Publisher;
            if(counts[key]){ group[counts[key]].groupsize++; }
            else{ counts[key] = k; group.push( {name : key, group : k, groupsize : 1, sizeorder : "0" } ); k++; }
            self.data[i].group = counts[key];
        }
        //data.groupの順番：人数が多い順
        group = group.sort(function(a,b){return b.groupsize - a.groupsize;});
        //人数が大きいほど配列の中央に
        for(var i=0;i<group.length;i++){
            if(i%2==0)group[i].sizeorder = parseInt(group.length/2) + i/2 ;
            else group[i].sizeorder = parseInt(group.length/2)-(i+1)/2;
        }
        group = group.sort(function(a,b){return a.group - b.group;});
        for(var i=0;i<self.data.length;i++)self.data[i].group = group[self.data[i].group].sizeorder;

        //console.log(self.data);
        //console.log(group);
        self.render();
    }

                                               
    render() {
        let self = this;
        
        var node = self.chart
            .selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", self.inner_width / 2)
            .attr("cy", self.inner_height / 2)
            .style("fill", function(d){ return d.piecolor; })
            .style("fill-opacity", 0.7)
            .attr("stroke", "black")
            .style("stroke-width", 0.1)
            .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));

        node
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style("color",d.labelcolor)
                    .style('opacity', 1)
                    .html(` <div class="tooltip-label">name</div>${d.name}
                            <div class="tooltip-label">Eye Color</div>${d.EyeColor}
                            <div class="tooltip-label">Race,Gender</div>${d.Race},${d.Gender}
                            <div class="tooltip-label">Publisher</div>${d.Publisher}
                            <div class="tooltip-label">Alignment</div>${d.Alignment} `);
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
            });

        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(self.inner_width / 2).y(self.inner_height / 2))
            .force("x", d3.forceX().strength(3).x( function(d){return (self.inner_width-100)/group.length*d.group +50   } ))
            .force("y", d3.forceY().strength(3).y( function(d){
                if(d.group%2==0) return self.inner_height/2;
                else return self.inner_height/4*3; } ))
            .force("charge", d3.forceManyBody().strength(1))
            .force("collide", d3.forceCollide().strength(.001).radius(30).iterations(1))

        simulation
            .nodes(self.data)
            .on("tick", function(d){
              node
                  .attr("cx", function(d){ return d.x; })
                  .attr("cy", function(d){ return d.y; })
            });
        
        function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(.03).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        function dragged(event, d) {
          d.fx = event.x;
          d.fy = event.y;
        }
        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(.00001);
          d.fx = null;
          d.fy = null;
        }
    }
                                               
}
