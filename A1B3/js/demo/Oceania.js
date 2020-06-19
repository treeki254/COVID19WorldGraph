google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Country','TotalCases'],
          ['Australia', 7285],
          ['New Zealand', 1504],
          ['French Polynesia', 60],
          ['New Caledonia', 21,],
          ['Fiji', 18,],
          ['Papua New Guinea', 8,],
        
      
        ]);

        var options = {
          chart: {
            title: '오세아니아(확진자 수)',
            subtitle: 'Oceania',
          }
        };

        var chart = new google.charts.Bar(document.getElementById('Oceania_div'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }