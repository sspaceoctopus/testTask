import moment from 'moment';
import $ from 'jquery';
import Highcharts from 'highcharts';


let getOptionsToHighCharts = function (chartName, list) {
    const Defaults = {
        temp: {
            chartType: 'spline',
            container: 'temp',
            title: 'Temperature during 3 days',
            yAxisTitle: 'Temperature',
            formatterString: ' °',
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    },
                    color: '#b0ff68'
                }
            },
            yAxisArray: list.tempList,
            yAxisMin: 0
        },
        wind: {
            chartType: 'spline',
            container: 'speed',
            title: 'Wind speed during 3 days',
            yAxisTitle: 'Wind speed',
            formatterString: ' m/s',
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: false
                    },
                    color: '#ff9e5e'
                }
            },
            yAxisArray: list.windList,
            yAxisMin: 0
        },
        clouds: {
            chartType: 'area',
            container: 'clouds',
            title: 'Cloudiness during 3 days',
            yAxisTitle: 'Cloudiness',
            formatterString: ' %',
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    },
                    color: '#ff80b3'
                }
            },
            yAxisArray: list.cloudsList,
            yAxisMin: 0
        },
        humidity: {
            chartType: 'column',
            container: 'humidity',
            title: 'Humidity during 3 days',
            yAxisTitle: 'Humidity',
            formatterString: ' %',
            plotOptions: {
                column: {
                    pointPadding: 0.01,
                    borderWidth: 0,
                    color: '#74dbff'
                }
            },
            yAxisArray: list.humidityList,
            yAxisMin: 0
        },
        pressure: {
            chartType: 'column',
            container: 'pressure',
            title: ' Atmospheric pressure on the sea level during 3 days',
            yAxisTitle: 'Pressure',
            formatterString: ' hPa',
            plotOptions: {
                column: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    color: '#bb91ff'
                }
            },
            yAxisArray: list.pressureList,
            yAxisMin: Math.min.apply(null, list.pressureList)
        }
    };

    return {
        chart: {
            renderTo: Defaults[chartName].container,
            type: Defaults[chartName].chartType
        },
        title: {
            text: Defaults[chartName].title
        },
        xAxis: {
            categories: list.dates
        },
        yAxis: {
            min: Defaults[chartName].yAxisMin,
            title: {
                text: Defaults[chartName].yAxisTitle
            },
            labels: {
                formatter: function () {
                    return this.value + Defaults[chartName].formatterString;
                }
            }
        },
        tooltip: {
            valueSuffix: Defaults[chartName].formatterString,
            crosshairs: true,
            shared: true
        },
        plotOptions: Defaults[chartName].plotOptions,
        series: [{
            name: list.cityName,
            marker: {
                symbol: 'square'
            },
            data: Defaults[chartName].yAxisArray
        }]
    };
};

let renderCharts = function (list) {
    const nameOfCharts = ['temp', 'wind', 'clouds', 'humidity', 'pressure'];
    nameOfCharts.forEach(function (item) {
        Highcharts.chart(getOptionsToHighCharts(item, list));
    });
};

let showCurrentWeatherParams = function (list) {
    const CURRENT_PARAMS = [
        {
            id: '#cityName',
            formatterString: '',
            val: list.cityName
        },
        {
            id: '#currentTemp',
            formatterString: '°C',
            val: list.tempList[0]
        },
        {
            id: '#currentPreasure',
            formatterString: 'hPa',
            val: list.pressureList[0]
        },
        {
            id: '#currentHumidity',
            formatterString: ' %',
            val: list.humidityList[0]
        },
        {
            id: '#currentWind',
            formatterString: 'm/s',
            val: list.windList[0]
        },
        {
            id: '#currentCloudiness',
            formatterString: '%',
            val: list.cloudsList[0]
        }
    ];

    CURRENT_PARAMS.forEach(function (el) {
        document.querySelector(el.id).innerText = `${el.val} ${el.formatterString}`;
    });

};

let showErrorMessage = function () {
    $('#modal').modal('show');
};

let getData = function (selectedCity = 'London,uk') {
    const APP_ID = '2e86897fa6a7f4dd056a29b3ccc7e8c4';
    const StatusCode = {
        ok: 200,
        notFound: 404
    };
    const XhrState = {
        done: 4
    };

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XhrState.done) {
            if (this.status === StatusCode.ok) {
                let result = JSON.parse(this.responseText);
                let chartBase = {
                    'cityName': result.city.name,
                    'dates': result.list.map(function (item) {
                        return moment(item.dt_txt).format('DD MMM HH:mm');
                    }),
                    'tempList': result.list.map(function (item) {
                        return item.main.temp;
                    }),
                    'humidityList': result.list.map(function (item) {
                        return item.main.humidity;
                    }),
                    'pressureList': result.list.map(function (item) {
                        return item.main.pressure;
                    }),
                    'windList': result.list.map(function (item) {
                        return item.wind.speed;
                    }),
                    'cloudsList': result.list.map(function (item) {
                        return item.clouds.all;
                    })
                };
                renderCharts(chartBase);
                showCurrentWeatherParams(chartBase);
            } else if (this.status === StatusCode.notFound) {
                showErrorMessage();
            }
        }
    };
    xhttp.open('GET', `http://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&cnt=16&APPID=${APP_ID}`);
    xhttp.send();
};

let initSearch = function () {
    let btn = document.querySelector('#citySubmit');
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        let selectedCity = document.querySelector('#cityInput').value;
        getData(selectedCity);
    });
};

export default {initSearch, getData};