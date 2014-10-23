
$(function() {

  Parse.initialize("6fr8ox9aLNZPnTF0kC0wVmbDusiQUmEen0jZzP39",
                   "PPAkV30D2UkOBHT62KNzA50gnZ2aLqW0WgojLF0M");

  function authenticate(){
	Parse.Cloud.run("loggedIn", {},{
	 success:function(result){
		 console.log(result);
	 },
	 error: function(error){
		 console.log(error);
		 Parse.history.navigate("", {trigger:true});
			 }
		 });	  
  }
  var quiz = Parse.Object.extend("Quiz",{
	  	  
	  initialize: function(){
		  
		  var self= this;
		  var scores = Parse.Object.extend("Scores");
		  var score = new scores();
		  var question;
		  this.score= score;
		  if(Parse.User.current()!=undefined){
			  score.set("userid", Parse.User.current().getUsername());
		  }
		  score.set("quizid", Number("12345"));
		  score.set("scores",[0]);
		  score.set("totalScore", 0);
	  },
	  getProgress: function(){
		return 1000-$("#progressbar").val(); 
	  },
	  newQuestion: function(q){
			  if(q==undefined){
				Parse.history.navigate("finalScore", {trigger: true});
			  }
			  else{
				  var self= this;
				  question= Parse.Object.extend("Question");
				  var questionQuery = new Parse.Query(question);
				  questionQuery.equalTo("objectId", q);
				  questionQuery.first({
					  success:function(res){
						  self.correctAnswer=res.get("correctAnswer");
						  $("#question").html(res.get("text"));
						  $("#alt1").html(res.get("answers").shift());
						  $("#alt2").html(res.get("answers").shift());
						  $("#alt3").html(res.get("answers").shift());
						  $("#alt4").html(res.get("answers").shift());
					  },	
				  });
			 }
		},
			 answer: function(e){
				  answer=$(e.target).text();
				  if(answer==this.correctAnswer){
					  this.correct();
				  }
				  else{
					  this.wrong();
					  console.log("you guessed wrong");
				  }
			  },
			  test: function(){
				  alert("test");
			  },
			  wrong: function(){
				this.score.add("scores", 0);
				question= this.attributes.questions.length;
				if(question>0){
					self.undelegateEvents();
				}
				else{
					this.score.save();
					console.log("wrong more questions");
					self.undelegateEvents();

				}
			  },
			  correct: function(){
				  console.log("correct");
				  this.score.add("scores", this.getProgress());
				  this.score.save();
				  this.score.set("totalScore", this.score.get("totalScore")+this.getProgress());
				  question= this.attributes.questions.length;
				  
				  if(question>0){
					  self.undelegateEvents();

				  }
				  else{
					  this.score.save();
					  self.undelegateEvents();
					  alert("no more questions");
					  
				  }
			  },
	  });
  var theQuiz = new quiz();
  var menuView = Parse.View.extend({
	 events: {
		 "click #startGameButton": "startGame",
		 "click #logOutButton": "logOut"
	 },
	 el: ".content",
	 
	 initialize: function(){
		 this.render();
		 authenticate();
	 },
	 startGame: function(){
		console.log("TODO: add gameView"); 
		Parse.history.navigate("quizSelector", {trigger:true});
		this.undelegateEvents();
	 },
	 logOut: function(){
		 Parse.User.logOut();
		 Parse.history.navigate("", {trigger:true});
	     this.undelegateEvents();
	     delete this; 
	 },
	 render: function(){
		 this.$el.html(_.template($("#menu-template").html()));
		 this.delegateEvents();
	 },
	 
  });
  var quizSelectorView = Parse.View.extend({
	 events: {
		 "click #IDSubmit": "toLobby",
		 "click #test": "checkLobby"
	 }, 
  	 el: ".content",
  	 
  	 initialize: function(){
  		 this.render();
  		authenticate();
  	 },
  	 toLobby: function(){
  		 var id= $("#quizID").val();
  		 localStorage.setItem("Quizid", id)
  		Parse.Cloud.run("toLobby", {gameNumber : localStorage.getItem("Quizid")}, {
			 success: function(result){
				console.warn(result);
				Parse.history.navigate("lobby", {trigger:true});
			 },
			 failure: function(error){
				 alert(error);
			 }
		 });
  	 },

  	checkLobby: function(){
  		localStorage.setItem("Quizid", Number(123));
  		Parse.Cloud.run("checkLobby", {gameNumber : localStorage.getItem("Quizid") },{
  	  		success: function(result){
  	  		}
  	  	});
  	}, 
  	 render: function(){
 		this.$el.html(_.template($("#quizSelector-template").html()));
		this.delegateEvents(); 
  	 }
  });
  var theLobby;
  var lobbyView = Parse.View.extend({
		 events: {
			 "click #readyButton": "startQuiz"
		 }, 
	  	 el: ".content",
	  	 initialize: function(){

	  		var self= this;
	  		this.render();
	  		authenticate();
	  		var quizId = Number(localStorage.getItem("Quizid"));
	  		var lobby = Parse.Object.extend("LobbyList");
	  		var lobbyQuery = new Parse.Query(lobby);
	  		lobbyQuery.equalTo("lobbyId", quizId);
	  		lobbyQuery.first({
	  			success:function(results){
	  				theLobby=results;
	  				theLobby.set("currentQuestion", 0);
	  				self.redir();
	  				var playerArray= results.attributes.players;
	  				for(a=0; a<playerArray.length; a++){
	  					$("#playerList").append('<li id="lobbyListPlayer"><span id="player">' + playerArray[a] + '</span></li>');
	  				}
	  			}
	  		});
	  	 },
	  	 redir: function(){
	  		var timeToStart=30000;
	  		
	  		function updateTime(){
	  			if (timeToStart>0){
	  				Parse.Cloud.run("getTime", {},{
			  	  		success: function(result){
			  	  			currentTime=result;
			  	  			console.warn(result);
			  	  			timeToStart=(startTime.getTime()-currentTime);
			  	  			console.log((startTime.getTime()-currentTime));
			  	  		}
			  	  	});
	  			}
	  			else{
	  				clearInterval(updater);
	  				Parse.history.navigate("quiz", {trigger:true});
	  			}
	  		}
	  		 
	  		var startTime = theLobby.get("startTime");
	  		var currentTime;
		  		var updater=setInterval(updateTime, 500);
	  	 },
	  	 startQuiz: function(){
	  		Parse.history.navigate("quiz", {trigger:true}); 
	  	 },	 
	  	 render: function(){
	 		this.$el.html(_.template($("#lobby-template").html()));
			this.delegateEvents(); 
	  	 }
	  });
  var correctAnswer;
  var score;
  var tQuiz;
  var query;
  var updater;
  var quizView = Parse.View.extend({

	  events: {
		"click .answer": "answer",
		"click .toMenu": "toMenu",
	  },
	  el: ".content",
	  
	  initialize: function (){
		  authenticate();
		  var id = localStorage.getItem("Quizid");
		  var numberId=Number(id);
		  var Score2 = Parse.Object.extend("Scores");
		  var sQuery = new Parse.Query(Score2);
		  sQuery.equalTo("quizid", numberId);
		  sQuery.descending("totalScore");
		  sQuery.first({
		  success:function(result){
			  console.log("se her");
			  console.log(result.attributes.scores.length);
			  theLobby.set("currentQuestion", result.attributes.scores.length);
			  theLobby.save();
			  }
		  });
		  
		  theLobby.save();
		  updater = setInterval(this.quizUpdater, 5000);
		  var timer= setTimeout(this.toScore, 24500); 
		  if(query==undefined){
			  correctAnswer;
			  self=this;	
			  this.render();
			  query = new Parse.Query(quiz);
			  console.log(query);
			  
			  query.equalTo("code", numberId);
			  query.first({
				  success: function(results){	 
					  console.warn(results);
					  theQuiz=results;
					  tQuiz=results;
					  results.newQuestion(results.attributes.questions.shift());
				  },
				  error: function(error){
					  console.log("no quiz with that code");
				  }
			  });
		  }
		  else{
			  var question = theQuiz.attributes.questions.shift();
			  if(question==undefined){
				  Parse.history.navigate("finalScore", {trigger:true});
			  }
			  else
				  theQuiz.newQuestion(question);
			  	  this.render();
		  }
	 },
	 quizUpdater: function(){
		 var players= theLobby.get("players");
		 for(a=0; a<players.length; a++){
			 Parse.Cloud.run("quizUpdate", {name: players[a], lobby: theLobby.id},{
				 success:function(result){
					 console.log("result");
					 console.log(result);
				 },
				 error:function(error){
					 console.log(error);
				 }
			 })
		 }
		
	 },
	 toScore: function(){
		 clearInterval(updater);
		 if(tQuiz.attributes.questions.length==0){
			console.warn("to final from quiz");
			 Parse.history.navigate("finalScore", {trigger:true}); 
		 }
		 else{
			 console.log(tQuiz.attributes.questions);
			 Parse.history.navigate("score", {trigger:true});
			 console.log("in toScore");
		 }
	 },
	  
	  answer: function(e){
		  this.undelegateEvents();
		  altSelected(e);
		  waitingText();
		  tQuiz.answer(e);
	  },

	  toMenu: function(){
		 console.log("toMenu");
		 Parse.history.navigate("menu", {trigger:true});
		 this.undelegateEvents();		  
	  },
	  render: function(){
		this.$el.html(_.template($("#quiz-template").html()));
		this.delegateEvents(); 
	  }
  });
  var finalScoreView = Parse.View.extend({
	  el: ".content",
	  initialize: function(){
		  console.log("in final Score");
		  this.render();
	  },
	  render: function(){
		  this.$el.html(_.template($("#final-score-template").html()));
	  }
  });
  var questionNr=0;
  var p1Score=0;
  var p2Score=0;
  var p3Score=0;
  var scoreView = Parse.View.extend({
	 events: { 
		 "click #getUser": "getUser",
		 "click .toMenu": "toMenu",
		 "click #nextQuestion": "nextQuestion"
	 },
	 el: ".content",
	 
	 initialize: function(){
		 questionNr=questionNr+1;
		 var timer= setTimeout(this.toQuiz, 5000);
		 var self=this;
		 theQuiz.score.save();
		 authenticate();
		 this.render();
		 
		 
	 },
	 toQuiz: function(){
		 Parse.history.navigate("quiz", {trigger:true});
	 },
	 render: function(){
		 
		 this.$el.html(_.template($("#score-template").html()));
		 var sum= theQuiz.score.get("scores");
		 var totSum=0;
		 for(a=1; a<sum.length; a++){
			 totSum+=sum[a];
		 }
		 
		 var topScores = Parse.Object.extend("Scores");
		 var topQuery = new Parse.Query(topScores);
		 var opponents;
		 topQuery.limit(3);
		 topQuery.equalTo("quizid", theQuiz.get("code"));
		 topQuery.descending("totalScore");
		 topQuery.find({
			 success:function(result){
				 opponents=result;
				 var test=[];
				 
				 for(a=0; a<opponents.length; a++){ 
					 test.push(opponents[a].attributes.scores[questionNr]); 
				 }
				 p1Score = p1Score + opponents[0].attributes.scores[questionNr];
				 p2Score = p2Score + opponents[1].attributes.scores[questionNr];
				 p3Score = p3Score + opponents[2].attributes.scores[questionNr];
				 
				 $("#goldPoints").html(p1Score);
				 $("#goldName").html(opponents[0].attributes.userid);
				 $("#silverPoints").html(p2Score);
				 $("#silverName").html(opponents[1].attributes.userid);
				 $("#bronzePoints").html(p3Score);
				 $("#bronzeName").html(opponents[2].attributes.userid);

			 }
		 });

		 theQuiz.score.set("totalScore", totSum);
		 //theQuiz.score.save();
		 $("#getUser").html(totSum);
	 },
	 getUser: function(){
		 console.log(Parse.User.current());
	 },
	 nextQuestion: function(){
		 this.undelegateEvents();
		 Parse.history.navigate("quiz", {trigger:true});
	 },
	 toMenu: function(){
			 console.log("toMenu");
			 Parse.history.navigate("menu", {trigger:true});
			 this.undelegateEvents();		  
		  }
  });
  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },
    el: ".content",
    
    initialize: function() {
    	_.bindAll(this, "logIn", "signUp");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          Parse.history.navigate("menu", {trigger:true});
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();
      
      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
        	Parse.history.navigate("menu", {trigger:true});
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".signup-form .error").html(error.message).show();
          self.$(".signup-form button").removeAttr("disabled");
        }
      });
      this.$(".signup-form button").attr("disabled", "disabled");
      return false;
    },
    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });

  var AppView = Parse.View.extend({
    el: $("#timeshift"),

    initialize: function() {
    	this.render();
    },

    render: function() {
      if (Parse.User.current()) {
    	console.log("current user");
      	new menuView();
      	Parse.history.navigate("menu", {trigger:true});
      } else {
    	  console.log("no current user");
    	  Parse.history.navigate("", {trigger:true});
      }
    }
  });

  var AppRouter = Parse.Router.extend({
    routes: {
      "quiz": "quiz",
      "":	  "login",
      "menu": "menu",
      "score": "score",
      "finalScore": "finalScore",
      "quizSelector": "quizSelector",
      "lobby": "lobby"
      
    },

    initialize: function(options) {
    },
    
    quiz: function(){
    	new quizView();
    },
    login: function(){	
    	new LogInView();
    },
    menu: function(){
    	new menuView();
    },
    finalScore: function(){
    	new finalScoreView();
    },
    score: function(){
    	new scoreView();
    },
    quizSelector: function(){
    	new quizSelectorView();
    },
    lobby: function(){
    	new lobbyView();
    }
  });

  new AppRouter;
  new AppView;
  Parse.history.start();
});
