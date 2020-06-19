google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Country','TotalCases'],
            ['South Africa',58568],
            ['Egypt',39726],
            ['Nigeria',14554],
            ['Algeria',10589],
            ['Ghana',10358],
            ['Cameroon',8681],
            ['Morocco',8537],
            ['Sudan',6582],
            ['Senegal',4759],
            ['DRC',4515],
            ['Ivory Coast',4404],
            ['Djibouti',4398],
            ['Guinea',4372],
            ['Gabon',3463],
            ['Kenya',3215],
            ['Ethiopia',2670],
            ['Somalia',2513],
            ['Mayotte',2240],
            ['CAR',1952],
            ['Mali',1722],
            ['South Sudan',1670],
            ['Mauritania',1439],
            ['Guinea-Bissau',1389],
            ['Equatorial Guinea',1306],
            ['Madagascar',1203],
            ['Zambia',1200],
            ['Tunisia',1087],
            ['Sierra Leone',1085],
            /*['Niger',],
            ['Burkina Faso',],
            ['Chad',],
            ['Congo',],
            ['Uganda',],
            ['Cabo Verde',],
            ['Sao Tome and Principe',],
            ['Togo',],
            ['Tanzania',],
            ['Rwanda',],
            ['Mozambique',],
            ['Reunion',],
            ['Malawi',],
            ['Eswatini',],
            ['Liberia',],
            ['Libya',],
            ['Mauritius',],
            ['Zimbabwe',],
            ['Benin',],
            ['Comoros',],
            ['Angola',],
            ['Burundi',],
            ['Botswana',],
            ['Eritrea',],
            ['Namibia',],
            ['Gambia',],
            ['Seychelles',],
            ['Western Sahara',],
            ['Lesotho',],*/



    
        ]);

        var options = {
          chart: {
            title: '아프리카(확진자 수)',
            subtitle: 'Africa',
          }
        };

        var chart = new google.charts.Bar(document.getElementById('Africa_div'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }