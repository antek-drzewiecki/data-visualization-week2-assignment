// d3.legend.js
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence

(function() {
d3.legend = function(g) {
  g.each(function() {

    var g= d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])

    lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    svg.selectAll("[data-legend]").each(function() {
        var self = d3.select(this)
        items[self.attr("data-legend")] = {
          pos : self.attr("data-legend-pos") || this.getBBox().y,
          active: self.attr("active") == "1" ,
          color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke")
        }
      })

    items = d3.entries(items) //.sort(function(a,b) { return a.value.pos-b.value.pos})

    li.selectAll("text.name")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr("y",function(d,i) { return (i*1.5)+"em"})
        .attr("x","3.7em")
        .attr("class","name")
        .text(function(d) { return d.key})
        .style("fill", function(d) { return d.value.active ? "#000" : "CCC"})
        .style("cursor", "pointer")
        .on("click", function(d){
                // Determine if current line is visible
                var active   = d.value.active ? false : true,
                newOpacity = active ? 0 : 1;
                d3.select(this).style("fill", !active ? "#000" : "CCC")
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.value.active = active;
                })
        .on('mouseover', function(d) {
            console.log("#tag"+d.key.replace(/\s+/g, ''))
            d3.select("#tag"+d.key.replace(/\s+/g, ''))
            .transition()
           .duration(100)
           .style('stroke-width', 3)})
      .on('mouseout', function(d) {
        d3.select("#tag"+d.key.replace(/\s+/g, ''))
           .transition()
           .duration(100)
           .style('stroke-width', 1);
      });

    li.selectAll("text.tooltip")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr("class", "tooltip")
        .attr("y",function(d,i) { return (i*1.5)+"em"})
        .attr("x","1em")
        .style("fill",function(d) { return d.value.color})

    li.selectAll("circle")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("circle")})
        .call(function(d) { d.exit().remove()})
        .attr("cy",function(d,i) { return (i*1.5)-0.25+"em"})
        .attr("cx",0)
        .attr("r","0.4em")
        .style("fill",function(d) { return d.value.color})


    // Reposition and resize the box
    var lbbox = li[0][0].getBBox()
    lb.attr("x",(lbbox.x-legendPadding))
        .attr("y",(lbbox.y-legendPadding))
        .attr("height",(lbbox.height+2*legendPadding))
        .attr("width",(lbbox.width+2*legendPadding))
  })
  return g
}
})()
