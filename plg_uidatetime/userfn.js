function showAge(el){
	var msgContainer = $('#' + $(el).data('idmsgage'));
	if(!msgContainer.length) return;
	msgContainer.html(getAge($(el).val()));
}

function getAge(dateString,formato) {
	if (dateString == '') return '';
	var fmt = typeof formato != 'undefined'? formato : 'dd/mm/aaaa';
  var now = new Date();
  var today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  var yearNow = now.getFullYear();
  var monthNow = now.getMonth();
  var dateNow = now.getDate();
  
  var _year = fmt=='aaaa/mm/dd'?dateString.substring(0,4):parseInt(dateString.substring(6,10));
  var _month = fmt=='aaaa/mm/dd'?dateString.substring(5,7)-1:parseInt(dateString.substring(3,5))-1;
  var _day = fmt=='aaaa/mm/dd'?dateString.substring(8,10):parseInt(dateString.substring(0,2));
  
  var dob = new Date(_year,_month,_day);

	//console.log(dateString,fmt,dob);
  var yearDob = dob.getFullYear();
  var monthDob = dob.getMonth();
  var dateDob = dob.getDate();
  var age = {};
  var ageString = "";
  var yearString = "";
  var monthString = "";
  var dayString = "";
  yearAge = yearNow - yearDob;
  if (monthNow >= monthDob)
	var monthAge = monthNow - monthDob;
  else {
	yearAge--;
	var monthAge = 12 + monthNow -monthDob;
  }
  if (dateNow >= dateDob)
	var dateAge = dateNow - dateDob;
  else {
	monthAge--;
	var dateAge = 31 + dateNow - dateDob;
	if (monthAge < 0) {
	  monthAge = 11;
	  yearAge--;
	}
  }
  age = {
	  years: yearAge,
	  months: monthAge,
	  days: dateAge
	  };
  if ( age.years > 1 ) yearString = " a&ntilde;os";
  else yearString = " a&ntilde;o";
  if ( age.months> 1 ) monthString = " meses";
  else monthString = " mes";
  if ( age.days > 1 ) dayString = " d&iacute;as";
  else dayString = " d&iacute;a";
  if ( (age.years > 0) && (age.months > 0) && (age.days > 0) )
	ageString = age.years + yearString + ", " + age.months + monthString + ", y " + age.days + dayString; // + " old.";
  else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )
	ageString = "Solo " + age.days + dayString; // + " old!";
  else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )
	ageString = age.years + yearString; // + " old. Happy Birthday!!";
  else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )
	ageString = age.years + yearString + " y " + age.months + monthString; // + " old.";
  else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )
	ageString = age.months + monthString + " y " + age.days + dayString; // + " old.";
  else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )
	ageString = age.years + yearString + " y " + age.days + dayString; // + " old.";
  else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )
	ageString = age.months + monthString; // + " old.";
  else ageString = "Error! No se pudo calcular la edad!";
  return ageString;
}