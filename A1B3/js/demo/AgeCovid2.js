Highcharts.chart('AgeCovid2_div', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: '연령별 확진자수(명)'
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
        name: '확진자수(명)',
        data: [
            ['80이상', 498],
            ['70~79', 725],
            ['60~69', 1404 ],
            ['50~59', 2033],
            ['40~49', 1517],
            ['30~39', 1285],
            ['20~29', 3167],
            ['10~19', 655],
            ['0~9',157]
        ]
    }]
});