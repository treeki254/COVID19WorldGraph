
      google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Country','TotalCases'],
          
      ['China',83057],
      ['India',298283],   
      ['Iran',180156],
      ['Turkey',174023],
      [' Pakistan',119536],
      ['Saudi Arabia',116021],
      [' Bangladesh',78052],
      [' Qatar',75071],
      [' UAE',40986],
      [' Singapore',39387],
      [' Indonesia',35295],
      [' Kuwait',34432],
      [' Philippines',24175],
      [' Afghanistan',22890],
      ['Oman',19954],
      [' Israel',18569],
      [' Japan',17292],
      [' Iraq',16675],
      [' Bahrain',16667],
      ['Armenia',14669],
      ['Kazakhstan',13558],
      [' S. Korea',11947],
      [' Azerbaijan',8882],
      ['Malaysia',8369],
      ['Tajikistan',4834],
      ['Uzbekistan',4741],
      [' Nepal',4614],
      [' Thailand',3125],
      [' Kyrgyzstan',2129],
      ['Maldives',1976],
      ['Sri Lanka',1877],
      ['Lebanon',1402],
      ['Hong Kong',1108],
     /* [' Cyprus',975
],
      [' Jordan',890
],
      [' Georgia',831
],
      [' Yemen',591
],
      [' Palestine',487
],
      [' Taiwan',443
],
      [' Vietnam',332
],
      ['Myanmar',260
],
      [' Mongolia',194
],
      [' Syria',164
],
      [' Brunei',141
],
      [' Cambodia',126
],
      ['Bhutan',62
],
      [' Macao',45
],
      ['Timor-Leste',24
],
      [' Laos',19
]*/



    
        ]);

        var options = {
          chart: {
            title: '아시아(확진자 수)',
            subtitle: 'Asia',
          }
        };

        var chart = new google.charts.Bar(document.getElementById('Asia_div'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }