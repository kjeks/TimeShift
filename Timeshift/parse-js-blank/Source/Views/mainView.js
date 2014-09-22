

$(function() {

  Parse.$ = jQuery;

  Parse.initialize("6fr8ox9aLNZPnTF0kC0wVmbDusiQUmEen0jZzP39",
                   "PPAkV30D2UkOBHT62KNzA50gnZ2aLqW0WgojLF0M");


  
  var menuView = Parse.View.extend({
	 events: {
		 "click #startGameButton": "startGame",
		 "click #logOutButton": "logOut"
		 
	 },
	 el: ".content",
	 
	 initialize: function(){
		 this.render();
		 
	 },
	 startGame: function(){
		console.log("TODO: add gameView"); 
		new quizView();
		this.undelegateEvents();
	 },
	 logOut: function(){
		 Parse.User.logOut();
		 new LogInView();
	     this.undelegateEvents();
	     delete this; 
	 },
	 
	 render: function(){
		 this.$el.html(_.template($("#menu-template").html()));
		 this.delegateEvents();
	 },
	 
  });
  var quizView = Parse.View.extend({
	  events: {
		"click #answer": "answer",
		"click .toMenu": "toMenu" 
	  },
	  el: ".content",
	  
	  initialize: function (){
		  this.render();
	  },
	  answer: function(){
		  console.log("answer clicked");
	  },
	  toMenu: function(){
		 console.log("toMenu");
		 new menuView();
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
		 "click #toMenuButton": "toMenu"
	 },
	 el: ".content",
	 
	 initialize: function(){
		 this.render();
	 },
	 toMenu: function(){
		 console.log("toMenu");
		 new menuView();
		 this.undelegateEvents();
	 },
	 writeTo: function(){
		 console.log("writeto");
		 var Question = Parse.Object.extend("Question");
		 var question = new Question();
		 question.addUnique("answers", "a");
		 question.addUnique("answers", "b");
		 question.save(null, {
			  success: function(question) {
			    // Execute any logic that should take place after the object is saved.
			    alert("it worked");
			  },
			  error: function(question, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
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
	 
	 render: function(){
		 this.$el.html(_.template($("#anotherTest-template").html()));
		 this.delegateEvents();
	 },
	 

  });
  var TestView = Parse.View.extend({
	  events: {
		 "click #something": "test",
		 "click #logoutButton": "logOut",
		 "click #toAnother": "toAnother"
	 },
	 
	 el: ".content",
	 
	 initialize: function(){
		 this.render();
	 },
	 
	 test: function(){
		 console.log("test done");
	 },
	 toAnother: function(){
		 new anotherTestView();
		 this.undelegateEvents();
	 },
	 logOut: function(){
		 Parse.User.logOut();
		 new LogInView();
	     this.undelegateEvents();
	     delete this;
	 },
	 
	 render: function() {
	    this.$el.html(_.template($("#test-template").html()));
	    this.delegateEvents();
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
          new TestView();
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
          new TestView();
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

  // The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        new TestView();
      } else {
        new LogInView();
      }
    }
  });

  var AppRouter = Parse.Router.extend({
    routes: {
      "test": "test"
    },

    initialize: function(options) {
    },
    
    test: function() {
    	state.set({ filter: "test"});
    }
  });


  new AppRouter;
  new AppView;
  Parse.history.start();
});
