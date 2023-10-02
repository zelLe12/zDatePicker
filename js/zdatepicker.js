//Calendar Months
const calMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

//Calendar Days
const calDays = [
    'Su',
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa'
]

const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}
  
const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


//on page load
let input = document.getElementsByClassName("zdatepicker")
let wrap = document.createElement("div")
wrap.setAttribute("class", "zdatepicker-wrapper")
input[0].parentNode.insertBefore(wrap, input[0])
wrap.appendChild(input[0])

let cal = document.createElement("div")
cal.setAttribute("id", "calendar")
input[0].parentNode.insertBefore(cal, input[0].nextSibling)

//create calender
const createCalendar = () => {
    const calendarDiv = document.getElementById("calendar")

    const calendarWrap = document.createElement("div")
    calendarWrap.setAttribute("class", "calendarwrap")
    calendarWrap.classList.add("hide")
    
    const calendarHeader = document.createElement("div")
    calendarHeader.setAttribute("class","calendarheader")

    const calendarTitleDiv = document.createElement("div")
    calendarTitleDiv.setAttribute("class", "calendartitle")

    const calendarTitleSpan = document.createElement("span")
    calendarTitleSpan.setAttribute("class", "month-year")
    calendarTitleDiv.appendChild(calendarTitleSpan)

    const calendarDays = document.createElement("div")
    calendarDays.setAttribute("class", "calendardays")

    const calendarMain = document.createElement("div")
    calendarMain.setAttribute("class", "calendarmain")

    calendarDiv.appendChild(calendarWrap)
    
    calendarWrap.appendChild(calendarHeader)
    calendarHeader.appendChild(calendarTitleDiv)

    calendarWrap.appendChild(calendarDays)
    calendarWrap.appendChild(calendarMain)
}
createCalendar()

//set variables for calendar elements
const calendarWrap = document.querySelector(".calendarwrap")
const calendarBody = document.querySelector(".calendarmain")
const calendarHeader = document.querySelector(".calendarheader")
const calendarTitleDiv = document.querySelector(".calendartitle")
const calendarTitleSpan = document.querySelector(".calendartitle span")
const calendarDays = document.querySelector(".calendardays")

//get number of days in a month
const getNumberOfDays = (year, month) => {
    return 42 - new Date(year, month, 42).getDate()
}

//get day details
const getDayDetails = (args) => {
    let date = args.index - args.startFirstDay

    //get prevMonth day details
    let prevMonth = parseInt(args.month) - 1
    let prevMonthYear  = args.year
    if( prevMonth < 0 ) {
        prevMonth = 11
        prevMonthYear--
    }
    
    let prevMonthDays = getNumberOfDays(prevMonthYear, prevMonth)

    let nextMonth = parseInt(args.month) + 1
    let nextMonthYear = args.year
    if( nextMonth > 11 ) {
        nextMonth = 0
        nextMonthYear++
    }

    let _date = (date < 0 ? prevMonthDays + date : date % args.numberOfDays) + 1

    // -1 for prevMonth, 0 for currentMonth 1 for nextMonth
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0

    let timestamp
    if( month < 0 && args.year != prevMonthYear && args.year != nextMonthYear ) {
        //december of previous year
        timestamp = new Date(prevMonthYear, prevMonth, _date).getTime()
    } else if( month < 0 && args.year === prevMonthYear ) {
        //prevMonth on same year
        timestamp = new Date(args.year, prevMonth, _date).getTime()
    } else if( month > 0 && args.year != prevMonthYear && args.year != nextMonthYear ) {
        //nextMonth on next year
        timestamp = new Date(nextMonthYear, nextMonth, _date).getTime()
    } else if( month > 0 && args.year === nextMonthYear ) {
        //nextMonth on same year
        timestamp = new Date(args.year, nextMonth, _date).getTime()
    } else {
        //same month same year
        timestamp = new Date(args.year, args.month, _date).getTime()
    }

    let year
    if(args.month === 0 && month < 0) {
        year = args.year - 1
    } else if (args.month === 11 && month === 1) {
        year = args.year + 1
    } else {
        year = args.year
    }

    let dmonth
    if(month < 0) {
        dmonth = parseInt(args.month) - 1
    } else if (month > 0) {
        dmonth = parseInt(args.month) + 1
    } else {
        dmonth = parseInt(args.month)
    }
    
    return {
        date: _date,
        dmonth,
        month,
        year,
        timestamp
    };
}

//get month details
const getMonthDetails = (year, month) => {
    //day of first date of the month
    let startFirstDay = new Date(year, month).getDay()

    let numberOfDays = getNumberOfDays(year, month)
    let rows = 6;
    let index = 0;
    let cols = 7;
    monthDays = []

    for( let row = 0; row < rows; row++ ) {
        for (let col = 0; col < cols; col++) {
            day = getDayDetails({index, startFirstDay, cols, rows, year, month, numberOfDays})
            monthDays.push(day)
            index++
        }
    }

    return monthDays
}


const date = new Date()

//date today
const currentDay = date.getDate()
const currentMonth = date.getMonth()
const currentYear = date.getFullYear()
const currentDateTimeStamp = new Date(currentYear, currentMonth, currentDay).getTime()


const setDateToInput = (timestamp) => {
    let dateString = formatDate(timestamp);
    input[0].value = dateString;
};
setDateToInput(currentDateTimeStamp);

let month, year, selectedDay, selectedDayTimeStamp

//get input date
const isSelectedDay = (datestring) => {
    let inputDate = datestring
    let iDate = inputDate.split("-")
    let iDateMonth = parseInt(iDate[1]) - 1

    let y = iDate[0]
    let m
    if(iDateMonth < 0) {
        m = 11
    } else if (iDateMonth > 11) {
        m = 0
    } else {
        m = iDateMonth
    }
    
    selectedDay = parseInt(iDate[2])
    selectedDayTimeStamp = new Date(y, m, selectedDay).getTime()

    month = m
    year = y
    return {
        month, year, selectedDay, selectedDayTimeStamp
    }
}
let dSelectedDay = isSelectedDay(input[0].value)
month = dSelectedDay.month
year = dSelectedDay.year
selectedDay = dSelectedDay.selectedDay
selectedDayTimeStamp = dSelectedDay["selectedDayTimeStamp"]

let monthDetails = getMonthDetails(year, month)

const setMonthDetails = (monthDetails) => {
    
    monthDetails = getMonthDetails(year, month)
    
    for(let day in monthDetails) {
        let div = document.createElement("div")
        let span = document.createElement("span")

        if( monthDetails[day]["month"] == 0 ) {
            div.setAttribute("class","day cmday")
        } else {
            div.setAttribute("class","day mday")
        }

        if( monthDetails[day]["timestamp"] == currentDateTimeStamp ) {
            div.classList.add("currentDay")
        }
        if( monthDetails[day]["timestamp"] == selectedDayTimeStamp ) {
            div.classList.add("active")
            div.classList.add("selected")
        }
        
        span.innerText = monthDetails[day]["date"]

        dmonth = monthDetails[day]["dmonth"]
        dyear = monthDetails[day]["year"]
        dday = monthDetails[day]["date"]
        dDate = formatDate(monthDetails[day]["timestamp"])

        div.setAttribute("data-month", dmonth)
        div.setAttribute("data-year", dyear)
        div.setAttribute("data-date", dday)
        div.setAttribute("data-dateString", dDate)
        
        div.appendChild(span)
        calendarBody.appendChild(div)
    }
}
setMonthDetails(monthDetails)


const calendarTitle = (year, month, s) => {
    //calendarTitleSpan.innerHTML = calMonths[month] + " " + year

    if(s === "y") {
        calendarTitleSpan.innerHTML =  year
        calendarTitleDiv.setAttribute("data-set", "year")
    } else if( s === "yr") {
        let yr = getYearRange(year)
        yr.shift()
        yr.pop()
        let firstYear = yr[0]
        let lastYear = yr[9]

        calendarTitleSpan.innerHTML =firstYear + "-" + lastYear
        calendarTitleDiv.setAttribute("data-set", "year-range")
    } else {
        calendarTitleSpan.innerHTML = calMonths[month] + " " + year
        calendarTitleDiv.setAttribute("data-set", "month-year")
    }
}
calendarTitle(year, month)

//create arrow nav
const createArrowNav = () => {
    let prevNav = document.createElement("span")
    let nextNav = document.createElement("span")

    prevNav.setAttribute("id", "monthprev")
    prevNav.setAttribute("class", "cal-nav")
    prevNav.setAttribute("data-set", "month-year")
    
    nextNav.setAttribute("id", "monthnext")
    nextNav.setAttribute("class", "cal-nav")
    nextNav.setAttribute("data-set", "month-year")

    calendarHeader.appendChild(prevNav)
    calendarHeader.appendChild(nextNav)
}
createArrowNav()

const updateInput = () => {
    //day
    document.querySelectorAll(".day").forEach((d) => {
        d.addEventListener("click", () => {
            //remove all active and selected classes to all days
            document.querySelectorAll(".day").forEach((c) => {
                c.classList.remove("active","selected")
            })
            
            //set selected day active and selected classes; update input; update selectedday; hide calendar after date selection
            let iDate = d.getAttribute("data-date")
            d.classList.add("active", "selected")
            setDateToInput(d.getAttribute("data-datestring"))
            isSelectedDay(d.getAttribute("data-datestring"))
            document.querySelectorAll(".cal-nav").forEach((a) => {
                a.setAttribute("data-set","month-year")
            })
            calendarWrap.classList.toggle('hide')
        })
    });
};
updateInput();

const showMonths = (year, month) => {
    for(let i = 0; i < calMonths.length; i++) {
        let div = document.createElement("div")
        let span = document.createElement("span")

        div.setAttribute("data-month", i)
        div.setAttribute("data-year", year)
        div.setAttribute("class", "month")
        span.innerText = calMonths[i].slice(0, 3)

        if(i === month) {
            div.classList.add("active","selected")
        }

        div.appendChild(span)
        calendarBody.appendChild(div)
    }

    document.querySelectorAll(".month").forEach((m) => {
        m.addEventListener("click", () => {
            //change to month
            let mMonth = m.getAttribute("data-month")
            let mYear = m.getAttribute("data-year")
            updateMonth(mYear, mMonth)

            document.querySelectorAll(".cal-nav").forEach((a) => {
                a.setAttribute("data-set","month-year")
            })
        })
    })
}

const updateMonth = (y, m) => {
    //month
    month = m
    year = y

    let newMonthTimeStamp = new Date(y, m, 1).getTime()
    setDateToInput(newMonthTimeStamp)

    calendarTitle(y, m)

    updateCalendar("month")
    updateInput()
}


const getYearRange = (startYear) => {
    //set 10 years per range but show 12
    let firstThree = startYear.toString().substring(0,3)

    let yearRange = []

    for( let i = 0; i < 10; i++) {
        yearRange.push(firstThree+i)
    }

    let previousSetLast = parseInt(yearRange[0]) - 1
    yearRange.unshift(previousSetLast)

    let nextSetFirst = parseInt(yearRange[10]) + 1

    yearRange.push(nextSetFirst)
    
    return yearRange
}

const setYearRange = (sYear) => {
    let newYearRange = getYearRange(sYear)

    for(let i = 0; i < newYearRange.length; i++) {
        let div = document.createElement("div")
        let span = document.createElement("span")

        div.setAttribute("class","year")

        if(i === 0) {
            div.classList.add("prevset")
        } else if( i === 11) {
            div.classList.add("nextset")
        }

        span.innerHTML = newYearRange[i]

        if(newYearRange[i] == sYear) {
            div.classList.add("active", "selected")
        }
        
        div.appendChild(span)
        calendarBody.appendChild(div)
    }

    document.querySelectorAll(".year").forEach((m) => {
        m.addEventListener("click", () => {
            //change to month
            year = parseInt(m.innerText)

            let navset = "year"
            
            calendarTitle(sYear, 0, "y")

            let nYearTimeStamp = new Date(sYear, month, selectedDay).getTime()
            setDateToInput(nYearTimeStamp)

            calendarBody.innerHTML = ""
            //showMonths(year, 0)
            updateCalendar(0, navset)

            document.querySelectorAll(".cal-nav").forEach((a) => {
                a.setAttribute("data-set", navset)
            })
        })
    })
}

const updateCalendar = (btn, set) => {
    let newCalendar, offset
    
    if( btn == "monthprev" ) {
        offset = -1
    } else if( btn == "monthnext" ) {
        offset = 1
    } else {
        offset = 0
    }

    if( set === "year") {
       newCalendar = calNav(offset, set)
       calendarTitle(newCalendar, month, "y")
       calendarBody.innerHTML = ""
       showMonths(newCalendar, month)
    } else if( set === "year-range") {
        newCalendar = calNav(offset, set)
        calendarTitle(newCalendar, month, "yr")
        calendarBody.innerHTML = ""
        setYearRange(newCalendar)
    } else { 
        newCalendar = calNav(offset, set)
        newMonthDetails = getMonthDetails(newCalendar.year, newCalendar.month)
        calendarTitle(newCalendar.year, newCalendar.month)
        calendarBody.innerHTML = ""
        setMonthDetails(newCalendar.MonthDetails)
    }
}


const calNav = (offset, set) => {
    
    if(set == "year") {
        year = parseInt(year) + offset
        return year
    } if(set == "year-range") {
        if(offset === -1) {
            year = parseInt(year) - 10
        } else if(offset === 1) {
            year = parseInt(year) + 10
        }

        return year
    } else {
        if(offset != 0) {
            month = parseInt(month) + offset
        }
    
        if( month === -1 ) {
            month = 11
            year--
        } else if( month === 12 ) {
            month = 0
            year++
        }

        monthDetails = getMonthDetails(year, month)
    
        return {
            year,
            month,
            monthDetails
        }
    }
}


document.querySelector(".zdatepicker").addEventListener("click", (i) => {
    calendarWrap.classList.toggle("hide")
})

document.querySelector(".calendartitle").addEventListener("click", (t) => {

    let set = document.querySelector(".calendartitle").getAttribute("data-set")

    let navset
    if(set == "month-year") {
        calendarTitle(year, month, "y")
        navset = "year"
    
        calendarBody.innerHTML = ""
        showMonths(year, month)

        document.querySelectorAll(".cal-nav").forEach((a) => {
            a.setAttribute("data-set", navset)
        })
    } else if(set == "year") {
        calendarTitle(year, month, "yr")
        navset = "year-range"
    
        calendarBody.innerHTML = ""
        setYearRange(year, month)

        document.querySelectorAll(".cal-nav").forEach((a) => {
            a.setAttribute("data-set", navset)
        })
    }
})

document.querySelectorAll(".cal-nav").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let btnID = e.target.id
        let set = e.target.getAttribute("data-set")
        updateCalendar(btnID, set)
        updateInput()
    })
})
