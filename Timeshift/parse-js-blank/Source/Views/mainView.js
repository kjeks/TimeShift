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
				 console.log(result);
			 },
		 });
		 Parse.Cloud.run("testu", {test: "testy"}, {
			 success: function(result){
				 console.log(result);
			 },
			 error: function(error){
				 console.log(error);
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
		 "click #IDSubmit": "startQuiz"
	 }, 
  	 el: ".content",
  	 
  	 initialize: function(){
  		 this.render();
  		authenticate();
  	 },
  	 startQuiz: function(){
  		 console.log(" do something");
  		 var id= $("#quizID").val();
  		 localStorage.setItem("Quizid", id);
  		 Parse.history.navigate("quiz", {trigger:true});
  	 },
  	 render: function(){
 		this.$el.html(_.template($("#quizSelector-template").html()));
		this.delegateEvents(); 
  	 }
  });
  var correctAnswer;
  var score;
  var quizView = Parse.View.extend({

	  events: {
		"click .answer": "answer",
		"click .toMenu": "toMenu" 
	  },
	  el: ".content",
	  
	  initialize: function (){
		  authenticate();
		  var scoreObj= Parse.Object.extend("Score");
		  score = new scoreObj();
		  score.set("points", 0);
		  
		  correctAnswer;
		  var theQuiz;
		  self=this;	
		  this.render();
		  console.log("getEmail");
	 	  var quiz = Parse.Object.extend("Quiz");
		  var query = new Parse.Query(quiz);
		  var id = localStorage.getItem("Quizid");
		  var numberId=Number(id);
		  console.log(numberId);
		  query.equalTo("code", numberId);
		  query.first({
			  success: function(results){	 
				  console.log(results);
				  self.theQuiz=results;
				  var firstQ=self.theQuiz.attributes.questions.shift();	
				  self.newQuestion(firstQ);
				 },
			  error: function(error){
				 console.log("no quiz with that code");
			  }
			  });
	  },
	  answer: function(e){
		  answer=$(e.target).text();
		  if(answer==self.correctAnswer){
			  self.correct();
		  }
		  else{
			  self.wrong();
			  console.log("you guessed wrong");
		  }
	  },
	  wrong: function(){
		
		quiz=self.theQuiz;
		question= quiz.attributes.questions.shift();
		if(question!=undefined){
			self.newQuestion(question);
		}
		else{
			localstorage.setItem("totScore", score.get("points"));
			Parse.history.navigate("score", {trigger:true});
		}
		
	  },
	  correct: function(){
		  
		  var points=score.get("points")+100;
		  score.set("points", points);
		  console.log(points);
		  quiz = self.theQuiz;
		  question= quiz.attributes.questions.shift();
		  console.log(question);
		  if(question!=undefined){
			  self.newQuestion(question);  
		  }
		  else{
			  alert("no more questions");
			  localStorage.setItem("totScore", points);
			  Parse.history.navigate("score", {trigger:true});
			  
		  }
	  },
	  newQuestion: function(q){
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
		 "click #getUser": "getUser"
	 },
	 el: ".content",
	 
	 initialize: function(){
		 authenticate();
		 this.render();
	 },
	 render: function(){
		 this.$el.html(_.template($("#score-template").html()));
		 $("#getUser").html(localStorage.getItem("totScore"));
	 },
	 getUser: function(){
		 console.log(Parse.User.current());
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
      console.log("when is this run?");
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
      "quizSelector": "quizSelector"
      
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
  });

  new AppRouter;
  new AppView;
  Parse.history.start();
});
