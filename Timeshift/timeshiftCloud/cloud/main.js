
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

var lobbyListu= Parse.Object.extend("LobbyList");
var lobbyList = [];

Parse.Cloud.define("checkLobby", function(request, response) { 
	var theLobbyList = new lobbyListu();
	theLobbyList.add("lobby",new Lobby(request.params.gameNumber, request.user));
	
	response.success(theLobbyList.get("lobby"));	
});

Parse.Cloud.define("toLobby", function(request, response) {
		var lobbyQuery = new Parse.Query(lobbyListu);
		var theLobbyList;
	    lobbyQuery.equalTo("lobbyId", Number(request.params.gameNumber));
	    lobbyQuery.find({
	    	success:function(results){
	    		if(results.length>0){
	    			theLobbyList = results[0];
	    			theLobbyList.addUnique("players", request.user.attributes.username);
	    			var created = theLobbyList.createdAt;
	    			var startTime = new Date();
	    			startTime.setTime(created.getTime()+(5*60*1000));
	    			theLobbyList.set("startTime", startTime);
	    			theLobbyList.save();
	    			response.success(startTime);
	    		}
	    		else{
	    			theLobbyList = new lobbyListu();
	    			//response.success("added new lobby");
		    		theLobbyList.set("lobbyId", Number(request.params.gameNumber));
		    		theLobbyList.addUnique("players", request.user.attributes.username);
		    		theLobbyList.save();
		    		response.success(request.user.attributes.username);
		    		
	    		}
	    	},
	    	error:function(error){
	    		response.error(error);
	    	}

	    });
	});