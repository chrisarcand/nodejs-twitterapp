exports.ppJSON = function ppJSON(obj) {
  //For debugging purposes
  //Pretty print a JSON object to the console
  console.log(JSON.stringify(obj, null, 4));
}

exports.isEmpty = function isEmpty(ob){
	//Warning: Only works if the object has no enumerable prototype properties
	for(var i in ob){ return false;}
	return true;
}