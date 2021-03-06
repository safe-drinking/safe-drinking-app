function goTo(location) {
    document.location.href = location;
}

// member
var drinks = Number(localStorage.getItem("sumDrinks"));
var i;
var eventName;
for (i = 0; i < Number(localStorage.getItem("events")); i++){
    var stored_drinks = localStorage.getItem("drinks_" + i);
    if (stored_drinks != null && stored_drinks != "NaN" && stored_drinks != undefined) {
        drinks += Number(stored_drinks);
    }
}
localStorage.setItem("sumDrinks", drinks);

// x values
var week = [6, 5, 4, 3, 2, 1, 0];
var month = [30, 27, 24, 21, 18, 15, 12, 9, 6, 3, 0];
var year = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

// y values
var week_data = JSON.parse(localStorage.getItem("week_data"));
week_data.push(Number(drinks));
var month_data = JSON.parse(localStorage.getItem("month_data"));
var year_data = JSON.parse(localStorage.getItem("year_data"));

var data_values = [year_data, month_data, week_data];
var data_types = [year, month, week];
var data_labels = ['year', 'month', 'week'];
var x_labels = ['Months Ago', 'Days Ago', 'Days Ago'];
var titles = ['Past 12 Months', 'Past 30 Days', 'Past 7 Days'];

var view_type = 2; // 0=>year, 1=>month, 2=>week
var cum;
var avg;


var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    showTooltips: false,
    type: 'line',
    data: {
        labels: week,
        datasets: [
            {
                data: week_data,
                label: "day of the week",
                borderColor: "#633b3b",
                pointHoverRadius: 20,
                pointHitRadius: 40,
                pointRadius: 12,
                // pointBorderColor: "#633b3b",
                pointColor:"#633b3b",
                pointBackgroundColor: "#633b3b"
                // backgroundColor: ["#633b3b"]
            }
        ]
    },
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Days Ago',
                    fontSize: 35,
                },
                ticks: {
                    fontSize: 40
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Drinks',
                    fontSize: 35,
                },
                ticks: {
                    fontSize: 40
                }
            }]
        },
        legend: {
            display: false,
        },
        onClick: pointClicked,
        tooltips: {
            enabled: false
        },
        title: {
            display: true,
            text: 'Past 7 Days',
            fontSize: 50,
            fontFamily: 'Nunito',
            fontStyle: 'bold',
            fontColor:'black'
        }
    }

});

function pointClicked(ctx, eventarr) {
    if (eventarr[0] == undefined) return;
    var index = eventarr[0]._index;
    var date_string = getDate(index);
    var drinks = data_values[view_type][index];
    document.getElementById('modal-drink-text').innerHTML = "You had " + drinks + " drinks " + date_string;
    $('#drinkModal').modal('show');
}

var months = ["April '18", "May '18", "June '18", "July '18", "August '18", "September '18", "October '18", "November '18", "December '18", "January '19", "February '19", "March '19"];
function getDate(index) {
    var days_ago = 0;
    var len = data_values[view_type].length - 1;
    var prefix = "";
    if (view_type == 0) {
        days_ago = 31 * (len - index);
        prefix = "in the month of";
    } else if (view_type == 1) {
        days_ago = 3 * (len - index);
        prefix = "on or around the day of";
    } else {
        days_ago = (len - index);
        prefix = "on the day of";
    }
    var d = new Date();
    d.setDate(d.getDate() - days_ago);
    str = d.toLocaleString().split(",")[0];

    if (view_type == 0) {
        str = months[index];
    }

    return prefix + " " + str;
}

var pills = ['pill1', 'pill2', 'pill3'];
function pillClick(num) {
    // update the active pill
    pills.forEach(function (x) {
        document.getElementById(x).className = "inactive";
    });
    document.getElementById(pills[num]).className = "active";

    // update chart
    view_type = document.getElementById(pills[num]).value;
    addData(myChart, data_labels[num], data_values[num], data_types[num], x_labels[num]);

    // update cum and avg
    init();
}

function addData(chart, label, data_y, data_x, x_label) {
    chart.data.labels = data_x;
    chart.options.scales.xAxes[0].scaleLabel.labelString = x_label;
    chart.options.title.text = titles[view_type];
    chart.data.datasets[0].data = data_y;
    chart.data.datasets[0].label = label;
    chart.update();
}

function updateCum() {
    cum = data_values[view_type].reduce(getSum, 0);;
}

function getSum(total, num) {
    return total + num;
}

function updateAvg() {
    avg = cum / (data_types[view_type][0]+1);
    avg = parseInt(avg * 100) / 100;
}

function init() {
    updateCum();
    updateAvg();
    document.getElementById('panel1').innerHTML = avg;
    document.getElementById('panel2').innerHTML = cum;
}

init();
$('#myModal').modal({ show: false })