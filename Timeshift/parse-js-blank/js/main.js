var answer = false;

function altClicked(){
	console.log("Clicked an alt");
	answer = true;
	getScore();
}

function readyClicked(){
	console.log("Clicked ready");
	document.getElementById("userLine").className = document.getElementById("userLine").className.replace( /(?:^|\s)glyphicon-remove(?!\S)/g , '' );
	document.getElementById("userLine").className = document.getElementById("userLine").className.replace( /(?:^|\s)glyphiconRed(?!\S)/g , '' );
	document.getElementById("userLine").className += " glyphicon-ok";
	document.getElementById("userLine").className += " glyphiconGreen";
	$("#readyIcon").show();
}

function showSignup(){
	$("#signupForm").show();
	$("#showsignuptext").hide();
}

function dots(){
	var dots = window.setInterval( function() {
		var wait = document.getElementById("waitDots");
		if ( wait.innerHTML.length > 2 ) 
   	 		wait.innerHTML = "";
		else 
    		wait.innerHTML += ".";
		}, 400);
}

function addPlayerToList(name){
	var ul = document.getElementById("playerList");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(name));
	ul.appendChild(li);
}

function randomNumber(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function addBots(amount){
	botNames = ["Anne", "Arne", "Are" , "Alex" , "Amalie" , "Berit" , "Bernt" , "Charlotte" , "Carl" , "Desire" , "Daniel" , "Dagrun" , "Erik" , "Eirill" , "Fredrik" , "Geir" , "Guro" , "Gerd" , "Heidi" , "Hallvard" , "Isa" , "Jonas" , "Jon" , "Josefine" , "Klaus" , "Kari" , "Line" , "Lars" , "Magnus" , "Mari" , "Nils" , "Nora" , "Oskar" , "Olivia" , "Per" , "Pernille" , "Rasmus" , "Reidun" , "Stian" , "Solvei" , "Thea" , "Thomas" , "Vilde" , "Vegar" , "Øystein" , "Åse" , "Ådmund"]
	var name;
	var scores = ["0"];
	var wait;
	
	for(i = 0; i < amount; i++){
		name = botNames[Math.floor(Math.random()*botNames.length)];
		wait = randomNumber(200, 800);
		for(j = 0; j<5; j++){
			scores.push(randomNumber(0, 975).toString());
		}
		addToList(name, scores, wait);
		scores = ["0"];
	}
}

function addToList(name, scores, wait){
	console.log("Added bot " + name + ". Joining in " + wait + " ms. with this score array: " + scores);
	setTimeout(function(){$("#playerList").append('<li class="lobbyList "><span class="glyphicon glyphicon-user"></span><span class="tab"> ' + name +'</span></li>')}, wait);
}

function notifyPlayer(){
	$("#notification").css({ opacity: 0 });
	$("#notification").fadeTo( 1200, 1 ); //kan spare tid ved å droppe denne
	$("#notificationSound").get(0).play();
	$("#notification").text(Math.random() + " has answered!");
	$("#notification").fadeTo( 1200, 0 );
}

function progressbar(){
	$("#progressbar").show();
	answer = false;
	clearInterval(animate);
	var progressbar = $('#progressbar'),
	max = progressbar.attr('max'),
	time = (1000/max)*20,	
	value = 0;
		
	var loading = function() {
		value += 1;
		var val = progressbar.val(value);
	        
		$('.progress-value').html(value + '%');

		if (value == max) {
			clearInterval(animate);
	        $('.progress-value').html(max + '%');
	    }
	};
	var animate = setInterval(function() {
		loading();
	}, time);
}

function gameSequence() {
	document.getElementById("number").src = "images/number3.png";
	$("#number").show();
	$("#notification").hide();
	setTimeout(function(){document.getElementById("number").src = "images/number2.png"}, 1000);
	setTimeout(function(){document.getElementById("number").src = "images/number1.png"}, 2000);
	setTimeout(function(){$("#number").hide()}, 3000);
	setTimeout(function(){$("#question").show()}, 3000);
	setTimeout(function(){$("#notification").show()}, 3000);
	setTimeout(function(){$("#alt1").show()}, 3000);
	setTimeout(function(){$("#alt2").show()}, 3000);
	setTimeout(function(){$("#alt3").show()}, 3000);
	setTimeout(function(){$("#alt4").show()}, 3000);
	setTimeout(function(){$("#menubutton").show()}, 3000);
	setTimeout(function(){progressbar()}, 3000);
}

function altSelected(e){
	$(e.target).css("background-color", "#3c424c");
}

function waitingText(){
	$("#question").text("You answered!");
}