var answer = false;

function altClicked(){
	console.log("Clicked an alt");
	answer = true;
	getScore();
}

function altSelected(){
	$(this).css('color', 'white');
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

//TODO: Force score screen og når neste spm kommer opp. Add bots med random timer. Vis og sorter score screen
function addBots(amount){
	botNames = ["Anne", "Arne", "Are" , "Alex" , "Amalie" , "Berit" , "Bernt" , "Charlotte" , "Carl" , "Desire" , "Daniel" , "Dagrun" , "Erik" , "Eirill" , "Fredrik" , "Geir" , "Guro" , "Gerd" , "Heidi" , "Hallvard" , "Isa" , "Jonas" , "Jon" , "Josefine" , "Klaus" , "Kari" , "Line" , "Lars" , "Magnus" , "Mari" , "Nils" , "Nora" , "Oskar" , "Olivia" , "Per" , "Pernille" , "Rasmus" , "Reidun" , "Stian" , "Solvei" , "Thea" , "Thomas" , "Vilde" , "Vegar" , "Øystein" , "Åse" , "Ådmund"]
	var name;
	var wait;
	for(i = 0; i<amount; i++){
		name = botNames[Math.floor(Math.random()*botNames.length)];
		//wait = randomNumber(200, 1000);
		setTimeout($("#playerList").append('<li class="lobbyList"><span class="tab">' + name + '</span></li>'), 750);
	}
}

function progressbar(){
	$("#progressbar").show();
	answer = false;
	clearInterval(animate);
	var progressbar = $('#progressbar'),
	max = progressbar.attr('max'),
	zero = 0,
	time = (1000/max)*20,	
	value = 0,
	start = Date.now();
	console.log("Start now " + start);
		
	var loading = function() {
		value += 1;
		var val = progressbar.val(value);
	        
		$('.progress-value').html(value + '%');

		if (value == max) {
			clearInterval(animate);
	        $('.progress-value').html(max + '%');
	        console.warn(Date.now() - start);
	    }
	};
	var animate = setInterval(function() {
		loading();
	}, time);
	
	
}

function getScore(){
	var 
	progressbar = $('#progressbar'),
	value = progressbar.val();
	
	console.log("Value: " + value);
	console.log("Score: " + (1000-value));
}

function gameSequence() {
	console.log("Started sequence");
	document.getElementById("number").src = "images/number3.png";
	$("#number").show();
	setTimeout(function(){document.getElementById("number").src = "images/number2.png"}, 1000);
	setTimeout(function(){document.getElementById("number").src = "images/number1.png"}, 2000);
	setTimeout(function(){$("#number").hide()}, 3000);
	setTimeout(function(){$("#question").show()}, 3000);
	setTimeout(function(){$("#alt1").show()}, 3000);
	setTimeout(function(){$("#alt2").show()}, 3000);
	setTimeout(function(){$("#alt3").show()}, 3000);
	setTimeout(function(){$("#alt4").show()}, 3000);
	setTimeout(function(){$("#menubutton").show()}, 3000);
	setTimeout(function(){progressbar()}, 3000);
}