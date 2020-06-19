google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Country','TotalCases'],
          ['Brazil',805649],
        ['Peru',214788],
         ['Chile',154092],
         ['Colombia',45212],
         ['Ecuador',44440],
          ['Argentina',27373],
          ['Bolivia',15281],
           ['Venezuela',2814],
           ['Paraguay',1230],
           /*['French Guiana',917],
               ['Uruguay',847],
          ['Suriname',168],
           ['Guyana',158],
           ['Falkland Islands',13],*/


    
        ]);

        var options = {
          chart: {
            title: '남아메리카(확진자 수)',
            subtitle: 'Sorth America',
          }
        };

        var chart = new google.charts.Bar(document.getElementById('SouthAmerica_div'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }