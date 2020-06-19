Highcharts.chart('AgeCovid4_div', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: '연령별 치명률(%)'
    },
    accessibility: {
        point: {
            valueSuffix: ''
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.y}(%)</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
    },
    series: [{
        type: 'pie',
        name: '치명률(%)',
        data: [
            ['80이상', 26.31],
            ['70~79', 10.9],
            ['60~69', 2.78],
            ['50~59', 0.74],
            ['40~49', 0.2],
            ['30~39', 0.16],
            
        ]
    }]
});