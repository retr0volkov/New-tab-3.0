// clock logic for new tab

// get the ISO week number of a date
function getWeekNumber(date) {
    var firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    var daysPassed = (date - firstDayOfYear) / 86400000;
    return Math.ceil((daysPassed + firstDayOfYear.getDay() + 1) / 7);
}

// code that runs once
function Setup()
{
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var weekDay = date.getDay();
    var weekNumber = getWeekNumber(date);

    // adding zeros
    day = (day < 10 ? "0" : "") + day;
    month = ((month + 1) < 10 ? "0" : "") + (month + 1);
    weekDay = weekDay == 0 ? 7 : weekDay;

    // combining in strings
    var dateString = day + "." + month + "." + year;
    var weekString = weekNumber + "." + weekDay;

    // accessing the elements
    document.getElementById("clock").children[1].textContent = weekString;
    document.getElementById("clock").children[2].textContent = dateString;
    Clock()
}

// code that runs every 500 ms
function Clock()
{
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // adding zeros
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    // combining in string
    var time = hours + ":" + minutes + ":" + seconds;

    // accessing the clock element
    document.getElementById("clock").children[0].textContent = time;

    // executing on the new day
    if (hours == 0 && minutes == 0 && seconds == 0) Setup();
}

Setup()
setInterval(Clock, 500);