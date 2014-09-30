
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!, this is the new version");
});
Parse.Cloud.define("testu", function(request, response) {
	  var returnVal = request.params.test;
	  if(returnVal!=undefined){
		  response.success(returnVal);
	  }
	  else{
		  response.error("error");  
	  }  
});
Parse.Cloud.define("loggedIn", function(request,response){
	var user = request.user;
	if(user==undefined){
		response.error("no user logged in");
	}
	else{
		response.success(user);
	}
});
Parse.Cloud.define("multiplayer", function(request,resonse){
	
});