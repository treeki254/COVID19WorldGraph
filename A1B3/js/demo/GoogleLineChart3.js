google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawVisualization);

      function drawVisualization() {

        var chartDateformat     = 'yyyy년MM월dd일';
        //라인차트의 라인 수
        var chartLineCount    = 10;
        //컨트롤러 바 차트의 라인 수
        //var controlLineCount    = 10;
        // Some raw data (not necessarily accurate)
        var data = new google.visualization.DataTable();
        data.addColumn('date', '날짜');
        data.addColumn('number', '누적 검사 횟수(꺽은선)');
        data.addColumn('number', '누적 검사 횟수(막대)');
        data.addRows([
            [new Date(2020,01,21),12161,12161],
            [new Date(2020,01,22),14816,14816],
            [new Date(2020,01,23),19275,19275],
            [new Date(2020,01,24),22077,22077],
            [new Date(2020,01,25),25577,25577],
            [new Date(2020,01,26),35823,35823],
            [new Date(2020,01,27),44981,44981],
            [new Date(2020,01,28),56395,56395],
            [new Date(2020,01,29),68918,68918],
            [new Date(2020,02,1),93459,93459],
            [new Date(2020,02,2),103539,103539],
            [new Date(2020,02,3),121039,121039],
            [new Date(2020,02,4),131379,131379],
            [new Date(2020,02,5),140755,140755],
            [new Date(2020,02,6),158456,158456],
            [new Date(2020,02,7),171422,171422],
            [new Date(2020,02,8),181384,181384],
            [new Date(2020,02,9),189236,189236],
            [new Date(2020,02,10),202631,202631],
            [new Date(2020,02,11),214640,214640],
            [new Date(2020,02,12),227129,227129],
            [new Date(2020,02,13),240668,240668],
            [new Date(2020,02,14),253249,253249],
            [new Date(2020,02,15),260050,260050],
            [new Date(2020,02,16),266268,266268],
            [new Date(2020,02,17),278396,278396],
            [new Date(2020,02,18),287234,287234],
            [new Date(2020,02,19),298459,298459],
            [new Date(2020,02,20),308012,308012],
            [new Date(2020,02,21),318710,318710],
            [new Date(2020,02,22),331780,331780],
            [new Date(2020,02,23),339075,339075],
            [new Date(2020,02,24),339545,339545],
            [new Date(2020,02,25),348579,348579],
            [new Date(2020,02,26),355701,355701],
            [new Date(2020,02,27),376961,376961],
            [new Date(2020,02,28),384555,384555],
            [new Date(2020,02,29),384558,384558],
            [new Date(2020,02,30),385533,385533],
            [new Date(2020,02,31),400778,400778],
            [new Date(2020,03,1),421547,421547],
            [new Date(2020,03,2),421767,421767],
            [new Date(2020,03,3),443273,443273],
            [new Date(2020,03,4),455032,455032],
            [new Date(2020,03,5),461233,461233],
            [new Date(2020,03,6),466804,466804],
            [new Date(2020,03,7),466973,466973],            
            [new Date(2020,03,8),475619,475619],
            [new Date(2020,03,9),492601,492601],
            [new Date(2020,03,10),499999,499999],
            [new Date(2020,03,11),499999,499999],
            [new Date(2020,03,12),504109,504109],
            [new Date(2020,03,13),508206,508206],
            [new Date(2020,03,14),516874,516874],
            [new Date(2020,03,15),523961,523961],
            [new Date(2020,03,16),528162,528162],
            [new Date(2020,03,17),535828,535828],
            [new Date(2020,03,18),554834,554834],
            [new Date(2020,03,19),558448,558448],
            [new Date(2020,03,20),558448,558448],
            [new Date(2020,03,21),560331,560331],
            [new Date(2020,03,22),567265,567265],
            [new Date(2020,03,23),573269,573269],
            [new Date(2020,03,24),578812,578812],
            [new Date(2020,03,25),584443,584443],
            [new Date(2020,03,26),587557,587557],
            [new Date(2020,03,27),590922,590922],
            [new Date(2020,03,28),597762,597762],
            [new Date(2020,03,29),603436,603436],
            [new Date(2020,03,30),609116,609116],
            [new Date(2020,04,1),612295,612295],
            [new Date(2020,04,2),616782,616782],
            [new Date(2020,04,3),620180,620180],
            [new Date(2020,04,4),623120,623120],
            [new Date(2020,04,5),629443,629443],
            [new Date(2020,04,6),632289,632289],
            [new Date(2020,04,7),638578,638578],
            [new Date(2020,04,8),644041,644041],
            [new Date(2020,04,9),649190,649190],
            [new Date(2020,04,10),653012,653012],
            [new Date(2020,04,11),657583,657583],
            [new Date(2020,04,12),669954,669954],
            [new Date(2020,04,13),669954,669954],
            [new Date(2020,04,14),700493,700493],
            [new Date(2020,04,15),715729,715729],
            [new Date(2020,04,16),730108,730108],
            [new Date(2020,04,17),736603,736603],
            [new Date(2020,04,18),742146,742146],
            [new Date(2020,04,19),754496,754496],
            [new Date(2020,04,20),765323,765323],
            [new Date(2020,04,21),777562,777562],
            [new Date(2020,04,22),777562,777562],
            [new Date(2020,04,23),803255,803255],
            [new Date(2020,04,24),809099,809099],
            [new Date(2020,04,25),815231,815231],
            [new Date(2020,04,26),828250,828250],
            [new Date(2020,04,27),828250,828250],
            [new Date(2020,04,28),857322,857322],
            [new Date(2020,04,29),873718,873718],
            [new Date(2020,04,30),891463,891463],
            [new Date(2020,04,31),899354,899354],
            [new Date(2020,05,1),909888,909888],
            [new Date(2020,05,2),928310,928310],
            [new Date(2020,05,3),945262,945262],
            [new Date(2020,05,4),962229,962229],
            [new Date(2020,05,5),979292,979292],
            [new Date(2020,05,6),993586,993586],
            [new Date(2020,05,7),1000993,1000993],
            [new Date(2020,05,8),1006400,1006400],
            [new Date(2020,05,9),1024145,1024145],
            [new Date(2020,05,10),1040070,1040070],
            [new Date(2020,05,11),1054941,1054941],
            [new Date(2020,05,12),1069484,1069484],
            [new Date(2020,05,13),1082653,1082653],
            [new Date(2020,05,14),1088243,1088243],
            [new Date(2020,05,15),1093598,1093598],
            [new Date(2020,05,16),1107612,1107612],




            
            
            
        ]);

        
        /*var control = new google.visualization.ControlWrapper({
              controlType: 'ChartRangeFilter',
              containerId: 'controls_div',  //control bar를 생성할 영역
              options: {
                  ui:{
                        chartType: 'line',
                        chartOptions: {
                        chartArea: {'width': '60%','height' : 80},
                          hAxis: {'baselineColor': 'none', format: chartDateformat, textStyle: {fontSize:12},
                           gridlines:{count:controlLineCount,units: {
                                  years : {format: ['yyyy년']},
                                  months: {format: ['MM월']},
                                  days  : {format: ['dd일']}}
                                 
                            }}
                        }
                  },
                    filterColumnIndex: 0
                }
            });*/
        var options = {
          title : '전국 Covid19 누적검사',
          vAxis: {title: 'Examinations'},
          hAxis    : {title:'Date',format: chartDateformat, gridlines:{count:chartLineCount,units: {
                                                                  years : {format: ['yyyy년']},
                                                                  months: {format: ['MM월']},
                                                                  days  : {format: ['dd일']}},
                                                                  
        },textStyle: {fontSize:12}},
          seriesType: 'line',
          series: {1: {type: 'bars', color:'orange'}},                                                                     
          
        };
        var date_formatter = new google.visualization.DateFormat({ pattern: chartDateformat});
        date_formatter.format(data, 0);


        var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }

      /*var dashboard = new google.visualization.Dashboard(document.getElementById('Line_Controls_Chart'));
            window.addEventListener('resize', function() { dashboard.draw(data); }, false); //화면 크기에 따라 그래프 크기 변경
            dashboard.bind([control],[charts]);
            dashboard.draw(data);*/
 
        
          //google.charts.setOnLoadCallback(drawDashboard);
    