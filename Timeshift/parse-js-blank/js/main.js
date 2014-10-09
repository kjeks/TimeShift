var answer = false;


$("#test1").click(function() {
	console.log("Calling sequence");
	setTimeout(function(){gameSequence()}, 100);
});
	
//Legg til alt1 også når testing er ferdig
$("#test2, #test3, #test4").click(function () {
	console.log("Clicked an alt");
	answer = true;
	getScore();
});

function altClicked(){
	console.log("Clicked an alt");
	answer = true;
	getScore();
	progressbar
}

function showSignup(){
	$("#signupForm").show();
	$("#showsignuptext").hide();
}


function progressbar(){
	$("#progressbar").show();
	answer = false;
	clearInterval(animate);
	var progressbar = $('#progressbar'),
	max = progressbar.attr('max'),
	zero = 0,
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
		if (answer) {
			clearInterval(animate);
			$('.progress-value').html(zero + '%');
			console.log(progressbar.val(value));
			console.log("zero?");
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