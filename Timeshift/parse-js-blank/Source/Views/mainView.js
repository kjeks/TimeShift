$(function() {

  Parse.initialize("6fr8ox9aLNZPnTF0kC0wVmbDusiQUmEen0jZzP39",
                   "PPAkV30D2UkOBHT62KNzA50gnZ2aLqW0WgojLF0M");

  function authenticate(){
	Parse.Cloud.run("loggedIn", {},{
	 success:function(result){
		 },
	 error: function(error){
		 console.log(error);
		 Parse.history.navigate("", {trigger:true});
			 }
		 });	  
  }
  var view = this;
  var quiz = Parse.Object.extend("Quiz",{
	  	  
	  initialize: function(){
		  
		  var self= this;
		  var scores = Parse.Object.extend("Scores");
		  var score = new scores();
		  this.score= score;
		  if(Parse.User.current()!=undefined){
			  score.set("userid", Parse.User.current().getUsername());
		  }
		  score.set("quizid", Number("12345"));
		  score.set("scores",[0]);;
	  },
	  getProgress: function(){
		return 1000-$("#progressbar").val(); 
	  },
	  newQuestion: function(q){
			  var self= this;
			  var question= Parse.Object.extend("Question");
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
				}
		  });
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
					Parse.history.navigate("score", {trigger: true});
				}
				else{
					this.score.save();
					console.log("wrong more questions");
					self.undelegateEvents();
					Parse.history.navigate("score", {trigger:true});
				}
			  },
			  correct: function(){
				  console.log("correct");
				  this.score.add("scores", this.getProgress());
				  question= this.attributes.questions.length;
				  if(question>0){
					  self.undelegateEvents();
					  Parse.history.navigate("score", {trigger: true});
					  //this.newQuestion(question);  
				  }
				  else{
					  this.score.save();
					  self.undelegateEvents();
					  alert("no more questions");
					  Parse.history.navigate("score", {trigger:true});					  
				  }
			  },
	  });
  
  
  var theQuiz = new quiz();
  var menuView = Parse.View.extend({
	 events: {
		 "click #startGameButton": "startGame",
		 "click #logOutButton": "logOut",
		 "click #toTests": "toTests"
	 },
	 el: ".content",
	 
	 initialize: function(){
		 this.render();
		 Parse.Cloud.run("hello", {}, {
			 success: function(result){
			 },
		 });
		 Parse.Cloud.run("testu", {test: "testy"}, {
			 success: function(result){
			 },
			 error: function(error){
			 }
		 });
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
	 toTests: function(){
		 Parse.history.navigate("anotherTest", {trigger:true});
		 this.undelegateEvents();
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
	  		 //trenger en funksjon som henter ut starttime fra database og sender til viewet når den tiden går ut. starttime-currentTime delay start
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
	  				self.redir();
	  				var playerArray= results.attributes.players;
	  				for(a=0; a<playerArray.length; a++){
	  					$("#playerList").append('<li><span class="tab">' + playerArray[a] + '</span></li>');
	  				}
	  			}
	  		});
	  		
	  	 },
	  	 redir: function(){
	  		 var startTime = theLobby.get("startTime");
	  		 var currentTime;
	   		Parse.Cloud.run("getTime", {},{
	  	  		success: function(result){
	  	  			currentTime=result;
	  	  		}
	  	  	});
	  		 
	  		 
	  		 console.log((startTime.getTime()-currentTime)/1000);
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
  var quizView = Parse.View.extend({

	  events: {
		"click .answer": "answer",
		"click .toMenu": "toMenu",
	  },
	  el: ".content",
	  
	  initialize: function (){
		  authenticate();
		  if(query==undefined){
			  correctAnswer;
			  self=this;	
			  this.render();
			  query = new Parse.Query(quiz);
			  var id = localStorage.getItem("Quizid");
			  var numberId=Number(id);
			  query.equalTo("code", numberId);
			  query.first({
				  success: function(results){	 
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
			  theQuiz.newQuestion(theQuiz.attributes.questions.shift());
			  this.render();
		  }
		  },
	  
	  answer: function(e){
		  this.undelegateEvents();
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
  var scoreView = Parse.View.extend({
	 events: { 
		 "click #getUser": "getUser",
		 "click .toMenu": "toMenu",
		 "click #nextQuestion": "nextQuestion"
	 },
	 el: ".content",
	 
	 initialize: function(){
		 var self=this;
		 authenticate();
		 this.render();
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
		 topQuery.descending("totalScore");
		 topQuery.find({
			 success:function(result){
				 opponents=result;
				 for(a=0; a<opponents.length; a++){
					 var test=opponents[a].attributes.scores[1];
				 }
			 }
		 });

		 theQuiz.score.set("totalScore", totSum);
		 theQuiz.score.save();
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
	 
  
  var anotherTestView = Parse.View.extend({
	 events: {
		 "click #getEmail": "getEmail",
		 "click #writeTo": "writeTo",
		 "click .toMenu": "toMenu"
	 },
	 el: ".content",
	 
	 initialize: function(){
		 authenticate();
		 this.render();
	 },
	 toMenu: function(){
		 console.log("toMenu");
		 Parse.history.navigate("menu", {trigger:true});
		 this.undelegateEvents();
	 },
	 render: function(){
		 this.$el.html(_.template($("#anotherTest-template").html()));
		 this.delegateEvents();
	 },
	 writeTo: function(){
		 console.log("writeto");
		 var Question = Parse.Object.extend("Question");
		 var question = new Question();
		 question.addUnique("answers", "a");
		 question.addUnique("answers", "b");
		 question.save(null, {
			  success: function(question) {
			    alert("it worked");
			  },
			  error: function(question, error) {
			    alert('Failed to create new object, with error code: ' + error.message);
			  }
			});
	 },
	 getEmail: function(){
		 console.log("getEmail");
		 var user = Parse.Object.extend("User");
		 var query = new Parse.Query(user);
		 query.equalTo("username", "kjeks");
		 query.first({
			 success: function(results){
				 console.log(results.get("email"));
			 },
		 error: function(error){
			 console.log("error");
		 }
		 });
	 },
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
      "test": "test",
      "quiz": "quiz",
      "":	  "login",
      "menu": "menu",
      "score": "score",
      "anotherTest": "anotherTest",
      "quizSelector": "quizSelector",
      "lobby": "lobby"
      
    },

    initialize: function(options) {
    },
    
    test: function() {
    	state.set({ filter: "test"});
    },
    quiz: function(){
    	new quizView();
    },

    anotherTest: function(){
    	new anotherTestView();
    },
    login: function(){	
    	new LogInView();
    },
    menu: function(){
    	new menuView();
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
