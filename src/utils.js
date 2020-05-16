// parse a date in yyyy-mm-dd format
export function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}

export function formatDate(input) {
  // TODO move to constants
  var months = new Array();
  months[0] = "January";
  months[1] = "February";
  months[2] = "March";
  months[3] = "April";
  months[4] = "May";
  months[5] = "June";
  months[6] = "July";
  months[7] = "August";
  months[8] = "September";
  months[9] = "October";
  months[10] = "November";
  months[11] = "December";

  var parsedDate = parseDate(input);
  var formattedDate = months[parsedDate.getMonth()] + " " + parsedDate.getDate() + ", " + parsedDate.getFullYear();
  return formattedDate;
}

export function convertToString(date) {
  var dd = date.getDate();

  var mm = date.getMonth()+1; 
  var yyyy = date.getFullYear();
  if (dd < 10) {
      dd = '0' + dd;
  } 
  if (mm < 10) {
      mm = '0' + mm;
  }
  return yyyy + "-" + mm + "-" + dd;
}

export function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

export function formatAmount(amount) {
  return formatNumber(amount, '$');
}

export function formatSignupBonus(number) {
  return formatNumber(number);
}

function formatNumber(number, prefix = '') {
  var formattedNumber;
  if (number) {
    formattedNumber = prefix + Number(number).toLocaleString();
  } else {
    formattedNumber = '';
  }
  
  return formattedNumber;
}