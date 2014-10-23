
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
	var lobby = Parse.Object.extend("LobbyList");
	var query = new Parse.Query(lobby);
	
	query.get(request.params.lobby,{
		success:function(theLobby){
			var currentQuestion=theLobby.get("currentQuestion");
			var score = Parse.Object.extend("Scores");
			var sQuery = new Parse.Query(score);
			sQuery.equalTo("userid", request.params.name);
			sQuery.equalTo("quizid", theLobby.get("lobbyId"))
			sQuery.first({
				success:function(theScore){
					if(currentQuestion+1==theScore.get("scores").length){
						response.success([currentQuestion+1, theScore.get("scores").length, "if"]);
					}
					else{
						response.success([currentQuestion+1, theScore.get("scores").length, "else"]);
					}
				}
			});
		
		},
		error:function(error){
			request.error(error);
		}
	});
			
});	

	
/*	var Lobby = Parse.Object.extend("LobbyList");
	var query = new Parse.Query(Lobby);
	var players;
	var bool=false;
	query.get(request.params.lobby,{
		success:function(lobby){
			players=lobby.get("players");
			for(a=0; a<players.length; a++){
				if(bool==false){
					var score = Parse.Object.extend("Scores");
					var pQuery = new Parse.Query(score);
					pQuery.equalTo("userid", players[a]);
					pQuery.equalTo("quizid", lobby.get("lobbyId"));
					pQuery.first({
						success:function(result){
							if(lobby.get("currentQuestion")==result.get("scores").length-1){
								bool = true;
								response.success(a);
							}
							else{
								//response.error("no changes");
							}
						},
						error:function(error){
							response.error(error);
						}
					});	
				}
	
			}
		}
	});
*/	


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