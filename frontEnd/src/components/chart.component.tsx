import { Hourly } from '../services/api.service'
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { Line } from 'solid-chartjs'
import { Resource, createEffect, onMount } from 'solid-js'

type ChartProps = {
  hourly: Resource<Hourly>
}
export function ChartComponent({ hourly }: ChartProps) {
  let chart
  // onMount(() => {
  // chart = new Chart(Title, Tooltip, Legend, Colors)
  // })

  // const chartData = {
  //   labels: hourly()?.time,
  //   datasets: [
  //     {
  //       label: 'Temp',
  //       data: hourly()?.temperature_2m,
  //     },
  //     {
  //       label: 'Tw',
  //       data: hourly()?.WetBulb2M,
  //     },
  //   ],
  // }
  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  // }
  // Chart.update()

  return (
    <div style='width: 800px;'>
      <canvas id='chart'></canvas>
    </div>
  )
}
