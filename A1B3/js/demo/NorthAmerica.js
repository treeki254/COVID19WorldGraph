google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Country','TotalCases'],
          ['USA',2089701],
          ['Mexico',129184],
          ['Canada',97530],
          ['Dominican',21437],
          ['Panama',18586],
          ['Guatemala',8221],
          ['Honduras',7360],
          ['Haiti',3796],
          ['El Salvador',3373],
          ['Cuba',2219],
          ['Costa Rica',1538],
          ['Nicaragua',1464],
            /*['Jamaica',605],
            ['Martinique',202],
            ['Cayman Islands',186],
            ['Guadeloupe',164],
            ['Bermuda',141],
            ['Trinidad and Tobago',117],
            ['Bahamas',103],
            ['Aruba',101],
            ['Barbados',96],
            ['Sint Maarten',77],
            ['Saint Martin',41],
            ['St. Vincent Grenadines',27],
            ['Antigua and Barbuda',26],
            ['Grenada',23],
            ['Curacao',22],
            ['Belize',20],
            ['Saint Lucia',19],
            ['Dominica',18],
            ['Saint Kitts and Nevis',15],
            ['Greenland',13],
            ['Turks and Caicos',12],
            ['Montserrat',11],
            ['British Virgin Islands',8],
            [' Caribbean Netherlands',7],
            ['St. Barth',6],
            ['Anguilla',3],
            ['Saint Pierre Miquelon',1],*/

    
        ]);

        var options = {
          chart: {
            title: '북아메리카(확진자 수)',
            subtitle: 'North America',
          }
        };

        var chart = new google.charts.Bar(document.getElementById('NorthAmerica_div'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }