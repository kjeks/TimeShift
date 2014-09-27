

$(function() {

  Parse.$ = jQuery;

  Parse.initialize("6fr8ox9aLNZPnTF0kC0wVmbDusiQUmEen0jZzP39",
                   "PPAkV30D2UkOBHT62KNzA50gnZ2aLqW0WgojLF0M");


  var menuView = Parse.View.extend({
	 events: {
		 "click #startGameButton": "startGame",
		 "click #logOutButton": "logOut",
		 "click #toTests": "toTests"
	 },
	 el: ".content",
	 
	 initialize: function(){
		 this.render();
		 
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
  var quizView = Parse.View.extend({

	  events: {
		"click .answer": "answer",
		"click .toMenu": "toMenu" 
	  },
	  el: ".content",
	  
	  initialize: function (){
		  var correctAnswer;
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
			  console.log("you guessed wrong");
		  }
	  },
	  correct: function(){
		  quiz = self.theQuiz;
		  self.newQuestion(quiz.attributes.questions.shift());
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
  var anotherTestView = Parse.View.extend({
	 events: {
		 "click #getEmail": "getEmail",
		 "click #writeTo": "writeTo",
		 "click .toMenu": "toMenu"
	 },
	 el: ".content",
	 
	 initialize: function(){
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
    quizSelector: function(){
    	new quizSelectorView();
    },
  });

  new AppRouter;
  new AppView;
  Parse.history.start();
});
