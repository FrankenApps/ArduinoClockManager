let showHelperToggle, rangeRed, rangeGreen, rangeBlue, clockModeToggle, stopWatchToggle, daylightSavingsToggle;

let secondsColor = '#00FF00';
let minutesColor = '#FF0000';
let hoursColor = '#0000FF';
let helperColor = '#EEEEEE';

$(document).ready(function() {
	//initalize Framework7 components
    showHelperToggle = app.toggle.get('#helperToggle');
    clockModeToggle = app.toggle.get('#uhrmodusToggle');
    stopWatchToggle = app.toggle.get('#stoppuhrToggle');
    daylightSavingsToggle = app.toggle.get('#sommerzeitToggle');
	rangeRed = app.range.get('#sliderRed');
	rangeGreen = app.range.get('#sliderGreen');
    rangeBlue = app.range.get('#sliderBlue');
    
    //find out if daylight savings is active currently and apply it as the default setting
    if(new Date().getTimezoneOffset() == -120){
        daylightSavingsToggle.toggle();
    }

	//get current settings from the esp8266
	/*$.post( "currentSettings", function(data) {
		let dataArray = data.split(',');
		secondsColor = dataArray[0];
		minutesColor = dataArray[1];
		hoursColor = dataArray[2];
		helperColor = dataArray[3];
		if (dataArray[4] == 'false') {
			showHelperToggle.toggle();
		}
		if (dataArray[6] == 'true') {
			daylightSavingsToggle.toggle();
		}
		if (dataArray[7] == 'false') {
			clockModeToggle.toggle();
		}
		if(dataArray[8] == 'true'){
			stopWatchToggle.toggle();
		}
		$('#ntpProvider').val(dataArray[9]);
	  });*/

	$('#secColor + i').css('border-color', secondsColor);
	$('#minColor + i').css('border-color', minutesColor);
	$('#hourColor + i').css('border-color', hoursColor);
	$('#helperColor + i').css('border-color', helperColor);

	//init the svg
	$.get('icon.svg', function(data) {
		$('#svgContainer').append(data.documentElement);
		var timeUpdater = setInterval(updateClock, 100);
	});

	$('#applySettings').on('click', function() {
		$.get('updateSettings', { settings: `${secondsColor},${minutesColor},${hoursColor},${helperColor},${showHelperToggle.checked},${daylightSavingsToggle.checked},${clockModeToggle.checked},${stopWatchToggle.checked},${$('#ntpProvider').val()}`});
	});
});

function updateClock() {
	//get new time
	d = new Date();
	let seconds = d.getSeconds();
	let minutes = d.getMinutes();
    let hours = d.getHours();
    let time_offset = 0;
    
    //calculate daylight savings toggle
    if(new Date().getTimezoneOffset() == -120 && daylightSavingsToggle.checked == false){
        time_offset = -1;
    }   else if(new Date().getTimezoneOffset() == -60 && daylightSavingsToggle.checked == true){
        time_offset = 1;
    }

	$('#timeDisplay').html(
		`${('0' + String(hours+time_offset)).slice(-2)}:${('0' + String(minutes)).slice(-2)}:${('0' + String(seconds)).slice(-2)}`
	);

	//get user configurations
	let showHelper = showHelperToggle.checked;

	let currentUserColor = `rgb(${rangeRed.value},${rangeGreen.value},${rangeBlue.value})`;
	$('#colorBox').css('background-color', currentUserColor);
	$(':root').css('--f7-radio-active-color', currentUserColor);

	switch (parseInt($('input:checked[name=color-radio]').val())) {
		case 1:
			secondsColor = currentUserColor;
			$('input:checked[name=color-radio] + i').css('border-color', secondsColor);
			break;
		case 2:
			minutesColor = currentUserColor;
			$('input:checked[name=color-radio] + i').css('border-color', minutesColor);
			break;
		case 3:
			hoursColor = currentUserColor;
			$('input:checked[name=color-radio] + i').css('border-color', hoursColor);
			break;
		case 4:
			helperColor = currentUserColor;
			$('input:checked[name=color-radio] + i').css('border-color', helperColor);
			break;
		default:
			break;
	}

	//reset all pixels
	d3.selectAll('.led').style('fill', '#BDC3C7');

	//apply the styling configuration fitting for the current time
	if (showHelper) {
		d3.select('#led0').style('fill', helperColor);
		d3.select('#led15').style('fill', helperColor);
		d3.select('#led30').style('fill', helperColor);
		d3.select('#led45').style('fill', helperColor);
	}

	d3.select('#led' + String(seconds)).style('fill', secondsColor);
	d3.select('#led' + String(minutes)).style('fill', minutesColor);
	d3.select('#led' + String((hours+time_offset)*5)).style('fill', hoursColor);
}
