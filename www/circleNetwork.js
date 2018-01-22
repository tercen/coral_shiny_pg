//shiny output binding
var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  return $(scope).find(".circleNetwork");
};

binding.renderValue = function(el, data) {
  //empty the div so that it removes the graph when you change data
  $(el).empty()
  
  if(data!=null){
    //////////.JS//////////

    var radius = 1000;

    var cluster = d3.layout.cluster()
        .size([360, radius - 120]);

    var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var svg = d3.select("#" + $(el).attr('id')).append("svg")
      .attr("width", radius * 4)
      .attr("height", radius * 4)
      .call(d3.behavior.zoom().on("zoom", function () {
          svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
      }))
      .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

    d3.json("kinome_tree.json", function(error, root) {

      var nodes = cluster.nodes(root);

      var link = svg.selectAll("path.link")
          .data(cluster.links(nodes))
        .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

      var node = svg.selectAll("g.node")
          .data(nodes)
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);
      node.append("circle")
          .attr("r", 3.5);

      node.append("text")
          .attr("dy", ".31em")
          .attr("font-size", "10px")
          .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
          .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
          .text(function(d) { return d.name; });
    });

    function mouseover() {
      d3.select(this).select("circle").transition()
          .attr("r", 10)
      d3.select(this).select("text").transition()
          .attr("font-size", "60px");
    }

    function mouseout() {
      d3.select(this).select("circle").transition()
          .attr("r", 3.5)
      d3.select(this).select("text").transition()
          .attr("font-size", "10px");
    }


    d3.select(self.frameElement).style("height", radius * 2 + "px");

    //////////.JS//////////

    //closing if statement
  }
  //closing binding  
};

//Identify the class that this js modifies below in ....(binding, "CLASSNAME");....
//register the output binding
Shiny.outputBindings.register(binding, "circleNetwork");
