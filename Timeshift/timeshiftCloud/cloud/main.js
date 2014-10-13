
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
function Lobby(lobbyNr, player){
	this.lobbyNr = lobbyNr;
	this.players = [player];
}

var lobbyList= [];

Parse.Cloud.define("checkLobby", function(request, response) {
	lobby = new Lobby(request.params.gameNumber, request.user);
	lobbyList.push(lobby);
	response.success(lobbyList);	
});

Parse.Cloud.define("toLobby", function(request, response) {
	    if(lobbyList.length>0){
	    	for(a=0; a<lobbyList.length; a++){
		    	if(request.params.gameNumber==lobbyList[a].lobbyNr){
		    		//lobbyList[a].players.push(request.user);
		    		//response.success(lobbyList[a]);
		    		response.success("in if if");
		    	}
		    	else
		    		lobby = new Lobby(request.params.gameNumber, request.user);
		    		lobbyList.push(lobby);
		    		response.success("in if else");
		    }
	    }
	    else{
    		lobby = new Lobby(request.params.gameNumber, request.user);
    		lobbyList.push(lobby);
    		response.success("in else");
	    }
		
		//lobby = new Lobby(request.params.gameNumber, request.user);
		
		//response.success(lobby);
	});