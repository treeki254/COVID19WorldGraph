Highcharts.chart('AgeCovid3_div', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: '연령별 사망자수(명)'
    },
    accessibility: {
        point: {
            valueSuffix: ''
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.y}(명)</b>'
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
        name: '사망자수(명)',
        data: [
            ['80이상', 131],
            ['70~79', 79],
            ['60~69', 39],
            ['50~59', 15],
            ['40~49', 3],
            ['30~39', 2],
            ['20~29', 0],
            ['10~19', 0],
            ['0~9',0]
        ]
    }]
});