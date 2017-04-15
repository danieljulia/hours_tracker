Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};


Date.prototype.getWeekDay= function(){
    var d = new Date(+this);
	var weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	return weekday[d.getDay()];

};



toColor=function(str){

  str="c"+str;
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;

      //que siguin colors clars
      if(value<128) value+=128;
    //  if(value<128) value+=64;
      if(value>=256) value=255;

      colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

/**
graphs
*/


/*
function getColor(indx){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;

}*/

function getUserColor(i){
  return toColor(users[i].name);
}



function doGraph(data){

  var xScale = new Plottable.Scales.Linear();
  var yScale = new Plottable.Scales.Linear();
  var xAxis = new Plottable.Axes.Numeric(xScale, "bottom",function(i){return "wow"});
  var yAxis = new Plottable.Axes.Numeric(yScale, "left");
  var mylabel = new Plottable.Components.AxisLabel("hours", -90);



  var plot = new Plottable.Plots.Bar()
    .addDataset(new Plottable.Dataset(data))
    .x(function(d) { return d.x; }, xScale)
    .y(function(d) { return d.y; }, yScale)
    .attr("fill", function(d) { console.log("*",d.x);return getUserColor(d.x-1); })
    .animated(true)
    .labelsEnabled(true);
   //.label(mylabel);
  //  .attr("fill", function(d) { return d.val; }, colorScale)


    var chart = new Plottable.Components.Table([
      [yAxis, plot],
      [mylabel, null]
    ]);
      chart.renderTo("#graph");

}

window.addEventListener("resize", function() {
  plot.redraw();
});
