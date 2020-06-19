google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Country','TotalCases'],
            ['Russia',502436],
            ['UK',291409],
            ['Spain',289787],
            ['Italy',236142],
            ['Germany',186795],
            ['France',155561],
            ['Belgium',59711],
            ['Belarus',51816],
            ['Sweden',49479],
            ['Netherlands',48251],
            ['Portugal',35910],
            ['Switzerland',31044],
            ['Ukraine',29070],
            ['Poland',28201],
            ['Ireland',25238],
            ['Romania',21182],
            ['Austria',17034],
            ['Serbia',12102],
            ['Denmark',12035],
            ['Moldova',10727],
            ['Czechia',9855],
            ['Norway',8608],
            ['Finland',7064],
            ['Luxembourg',4052],
            ['Hungary',4039],
            ['North Macedonia',3538],
            ['Greece',3088],
            ['Bulgaria',3086],

            ['Bosnia and Herzegovina',2832],
            ['Croatia',2249],
            ['Estonia',1965],
            ['Iceland',1807],
            ['Lithuania',1752],
            ['Slovakia',1541],
            ['Slovenia',1488],
            ['Albania',1385],
            ['Latvia',1094],
            /*['Andorra',852],
            ['San Marino',691],
            ['Malta',640],
            ['Channel Islands',565],
            ['Isle of Man',336],
            ['Montenegro',324],
            ['Faeroe Islands',187],
            ['Gibraltar',176],
            ['Monaco',99],
            ['Liechtenstein',82],
            ['Vatican City',12],*/



    
        ]);

        var options = {
          chart: {
            title: '유럽(확진자 수)',
            subtitle: 'Europe',
          }
        };

        var chart = new google.charts.Bar(document.getElementById('europe_div'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }