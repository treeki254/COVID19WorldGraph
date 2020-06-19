google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
  
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
          ['City', 'TotalCases','DeathCases'],
            ["서울",855,4],
            ["경기",828,19],
            ["인천",203,0],
            ["강원",57,3],
            ["충북",60,0],
            ["세종",47,0],
            ["충남",146,0],
            ["대전",45,1],
            ["경북",1379,54],
            ["전북",21,0],
            ["대구",6882,184],
            ["전남",19,0],
            ["광주",32,0],
            ["경남",123,0],
            ["울산",50,1],
            ["부산",146,3],
            ["제주",14,0]
      
          ]);
  
          var options = {
            title: '시도별 확진자',
            color:"red"
          };
  
          var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
  
          chart.draw(data, options);
        }