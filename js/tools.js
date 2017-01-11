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
