import { Show, createEffect, createResource, createSignal, type Component } from 'solid-js'
import { SearchInput } from './components/search-input.component'

import { Chart } from 'chart.js/auto'
import styles from './App.module.css'
import { Dropdown } from './components/dropdown.component'
import { LocationResult, getForecast, searchLocations } from './services/api.service'

const App: Component = () => {
  const [query, setQuery] = createSignal('')
  const [locations] = createResource(query, searchLocations)
  const [location, setLocation] = createSignal<LocationResult>()
  const [show, setShow] = createSignal<boolean>(true)
  const [forecast] = createResource(location, getForecast)
  const actualTw = function () {
    const results = forecast()
    if (!results) return ''
    const hours = new Date().getHours()
    return results.WetBulb2M![hours].toFixed(2)
  }

  createEffect(() => {
    query()
    setShow(true)
  })

  createEffect(() => {
    if (forecast()) {
      new Chart(document.getElementById('chart') as any, {
        type: 'line',

        options: {
          animation: false,
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
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
          labels: forecast()?.time as string[],
          datasets: [
            {
              label: 'H',
              borderColor: '#277da1',
              backgroundColor: '#277da1',
              data: forecast()?.relativehumidity_2m as number[],
              yAxisID: 'hum',
            },
            {
              label: 'T',
              borderColor: 'green',
              backgroundColor: 'green',
              data: forecast()?.temperature_2m as number[],
              yAxisID: 'temp',
            },
            {
              label: 'Tw',
              borderColor: '#90be6d',
              backgroundColor: '#90be6d',
              data: forecast()?.WetBulb2M as number[],
              yAxisID: 'temp',
            },
            {
              label: 'Dangerous Tw',
              borderColor: '#f3722c',
              backgroundColor: '#f3722c',
              data: forecast()?.WetBulb2M?.map(() => 28),
              yAxisID: 'temp',
            },
            {
              label: 'Mortal Tw',
              borderColor: '#f94144',
              backgroundColor: '#f94144',
              data: forecast()?.WetBulb2M?.map(() => 35),
              yAxisID: 'temp',
            },
          ],
        },
      })
    }
  })

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <SearchInput setQuery={setQuery} />
        <Show when={show()}>
          <Show when={!locations.loading}>
            <Dropdown locations={locations()} setShow={setShow} setLocation={setLocation}></Dropdown>
          </Show>
        </Show>
        <Show when={!forecast.loading} fallback={<>Loading...</>}>
          <h3>
            Current Tw: <span>{actualTw()} °C</span>
          </h3>

          <div style='width: 800px;'>
            <canvas id='chart'></canvas>
          </div>
        </Show>
      </header>
    </div>
  )
}

export default App
