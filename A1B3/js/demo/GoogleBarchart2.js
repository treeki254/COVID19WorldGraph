google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawMaterial);

function drawMaterial() {
var data = google.visualization.arrayToDataTable([
['Korea,한국', 'TotalCases(코로나 확진자 수)', 'DeathCases(코로나 사망자 수)','Fatality(치사율)'],
['80이상', 498, 131, 26.31],
['70~79', 725, 79,10.9],
['60~69', 1404, 39,2.78],
['50~59', 2033, 15,0.74],
['40~49', 1517, 3,0.2],
['30~39', 1285, 2,0.16],
['20~29', 3167, 0,0],
['10~19', 655, 0,0],
['0~9', 157, 0,0]

]);

var options = {
chart: {
  title: 'Age of Korea Coivd Cases',
  height: 50,
 
},
hAxis: {
  title: 'DeathCases and TotalCases',
  minValue: 0
},

vAxis: {
  title: 'Korea Coivd Situation'
},
bars: 'horizontal'

};
var materialChart = new google.visualization.BarChart(document.getElementById('Barchart_div'));
materialChart.draw(data,options);
}