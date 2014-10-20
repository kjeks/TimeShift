
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var _ = require('underscore');


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
function setStartTime(lobbyList){
	var created= lobbyList.createdAt;
	var startTime = new Date();
	startTime.setTime(created.getTime()+(5*1000));
	lobbyList.set("startTime", startTime);
	lobbyList.save();
}
Parse.Cloud.define("getTime", function(request, response){
	response.success(Date.now());
});
Parse.Cloud.define("quizUpdate", function(request, response){
	var Lobby = Parse.Object.extend("LobbyList");
	var query = new Parse.Query(Lobby);
	query.get(request.params.lobby,{
		success:function(lobby){
			response.success(lobby.get("players"));
		}
	});
	var oldScore;
	var ScoreUpdate = Parse.Object.extend("ScoreUpdate");
	var sQuery= new Parse.Query(ScoreUpdate);
	sQuery.get(request.params.scoreUpdate,{
		success: function(scoreUpdate){
			oldScore=scoreUpdate.get("oldScore");
			if(oldScore!=request.params.totalScore){
				//response.success(true);
			}
			else{
				//response.success(false);
			}
		},
		error: function(error){
			response.error(error);
		}
	});
});

Parse.Cloud.define("toLobby", function(request, response) {
		var self = this;
		var lobbyQuery = new Parse.Query(lobbyListu);
		var theLobbyList;
	    lobbyQuery.equalTo("lobbyId", Number(request.params.gameNumber));
	    lobbyQuery.find({
	    	success:function(results){
	    		if(results.length>0){
	    			theLobbyList = results[0];
	    			theLobbyList.addUnique("players", request.user.attributes.username);
	    			theLobbyList.save();
	    			response.success("joined lobby");
	    		}
	    		else{
	    			theLobbyList = new lobbyListu();
	    			var created = theLobbyList.createdAt;
	    			var startTime = new Date();
		    		theLobbyList.set("lobbyId", Number(request.params.gameNumber));
		    		theLobbyList.addUnique("players", request.user.attributes.username);
		    		theLobbyList.save(null,{
		    			success: function(theLobbyList){
		    				response.success(theLobbyList);
		    				setStartTime(theLobbyList);
		    			}
		    		});
	    			//response.success("created new lobby");
		    		
	    		}
	    	},
	    	error:function(error){
	    		response.error(error);
	    	}

	    });
	});