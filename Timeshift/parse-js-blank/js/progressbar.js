var answer = false;

$(document).ready(function () {
	$("#test1").click(function() {
		console.log("Calling sequence");
		setTimeout(function(){gameSequence()}, 100);
	});
	
	//Legg til alt1 også når testing er ferdig
	$("#test2, #test3, #test4").click(function () {
		answer = true;
		getScore();
	});
});


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
		if (answer) {
			clearInterval(animate);
			$('.progress-value').html(0 + '%');
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
	document.getElementById("numbertest").src = "images/number3.png";
	$("#numbertest").show();
	
	$("#question").hide()
	$("#progressbar").hide();
	$("#test1").hide();
	$("#test2").hide();
	$("#test3").hide();
	$("#test4").hide();
	setTimeout(function(){document.getElementById("numbertest").src = "images/number2.png"}, 1000);
	setTimeout(function(){document.getElementById("numbertest").src = "images/number1.png"}, 2000);
	setTimeout(function(){$("#numbertest").hide()}, 3000);
	
	setTimeout(function(){$("#question").show()}, 3000);
	setTimeout(function(){$("#test1").show()}, 3000);
	setTimeout(function(){$("#test2").show()}, 3000);
	setTimeout(function(){$("#test3").show()}, 3000);
	setTimeout(function(){$("#test4").show()}, 3000);
	setTimeout(function(){progressbar()}, 3000);
}