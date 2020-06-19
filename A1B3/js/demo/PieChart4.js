Highcharts.chart('PieChart4_div', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: '세계 대륙별 총 확진자 수'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    accessibility: {
        point: {
            valueSuffix: ''
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y}(명) '
            }
        }
    },
    series: [{
        name:'대륙별 확진자',
        colorByPoint: true,
        data: [{
            name: 'Asia',
            y: 1499336,
            sliced: true,
            selected: true
        }, {
            name: 'Europe',
            y: 2157337,
            sliced: true,
            selected: true
        }, {
            name: 'North America',
            y: 2386473,
            sliced: true,
            selected: true
        }, {
            name: 'Oceania',
            y: 8896,
            sliced: true,
            selected: true
        }, {
            name: 'South America',
            y: 1312982,
            sliced: true,
            selected: true
       
        }]
    }]
});