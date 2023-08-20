import { ChartConfiguration, ScriptableLineSegmentContext } from 'chart.js';
import { Hourly } from './api.service';
import { AnyObject } from 'chart.js/dist/types/basic';


export const calcCurrentTw = function (data: Hourly) {
  const hour = new Date(Date.now()).getHours();
  const index = data.date.findIndex((date: Date) => date.getHours() === hour);

  const minutes = new Date(Date.now()).getMinutes();
  const y1 = data.WetBulb2M![index];
  const y2 = data.WetBulb2M![index + 1];

  if (y1 > y2) {
    const value = ((y2 - y1) * minutes) / 60;
    return (y1 + value).toFixed(2);
  }
  const value = ((y1 - y2) * minutes) / 60;
  return (y2 + value).toFixed(2);
};

const greyOldDates = function (ctx: ScriptableLineSegmentContext, value: AnyObject) {
  if (ctx.p1.parsed.x < Date.now()) return 'grey';


};

export const setChartOptions = function (forecast: Hourly): ChartConfiguration<"line"> {
  return {
    type: 'line',
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        annotation: {
          annotations: {
            today: {
              type: 'line',
              xMin: Date.now(),
              xMax: Date.now(),
              borderColor: 'rgb(75, 192, 192)',
              z: -1,
            },
            mortal: {
              type: 'box',
              yMin: 35,
              backgroundColor: 'rgba(228, 63, 63, 0.25)',
              z: -1,
            },
            dangerous: {
              type: 'box',
              xMin: forecast.time[0],
              xMax: forecast.time[forecast.time.length - 1],
              yMin: 28,
              yMax: 35,
              backgroundColor: 'rgba(228, 112, 63, 0.25)',
              z: -1,
            },
          },
        },
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            displayFormats: {
              hour: 'ddd HH:mm',
            },
            minUnit: "hour"
          },
        },
        temp: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'temp - °C',
          },

        },
        hum: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Relative Humidity - R%',
          },

          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      },
    },
    data: {
      labels: forecast.date,
      datasets: [
        {
          label: 'Relative Humidity',
          borderColor: 'rgba(63, 181, 228, 1)',
          backgroundColor: 'rgba(63, 181, 228, 0.75)',
          data: forecast.relativehumidity_2m,
          yAxisID: 'hum',
          tension: 0.4,
          pointStyle: false,
          segment: {
            borderColor: greyOldDates
          }
        },
        {
          label: 'Tempeature',
          borderColor: 'rgba(228, 112, 63, 1)',
          backgroundColor: 'rgba(228, 112, 63, 0.75)',
          data: forecast.temperature_2m,
          yAxisID: 'temp',
          tension: 0.4,
          pointStyle: false,
          segment: {
            borderColor: greyOldDates
          }
        },
        {
          label: 'Wet Bulb Temperature',
          borderColor: 'rgba(228, 63, 63, 1)',
          backgroundColor: 'rgba(228, 63, 63, 0.75)',
          data: forecast.WetBulb2M,
          yAxisID: 'temp',
          tension: 0.4,
          pointStyle: false,
          segment: {
            borderColor: greyOldDates
          }
        },
      ],
    },
  };
}


