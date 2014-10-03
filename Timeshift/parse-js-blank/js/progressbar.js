$(document).ready(function () {
	$("#alt1").click(function() {
		var progressbar = $('#progressbar'),
		max = progressbar.attr('max'),
		time = (1000/max)*20,	
		value = progressbar.val();

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
	});
	
	$("#alt2").click(function () {
		var 
		progressbar = $('#progressbar'),
		value = progressbar.val();
		
		console.log("Value: " + value);
		console.log("Score: " + (1000-value));
	});
});
