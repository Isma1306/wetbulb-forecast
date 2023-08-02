import { createResource, createSignal, type Component, For, Show, createEffect, onMount } from 'solid-js'
import { SearchInput } from './components/search-input.component'

import styles from './App.module.css'
import { getCurrentWeather, searchLocations, LocationResult, getForecast } from './services/api.service'
import { Dropdown } from './components/dropdown.component'
import { ChartComponent } from './components/chart.component'
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js/auto'
import { Line } from 'solid-chartjs'

const App: Component = () => {
  const [query, setQuery] = createSignal('')
  const [data] = createResource(query, searchLocations)
  const [location, setLocation] = createSignal<LocationResult>()
  const [show, setShow] = createSignal<boolean>(true)
  const [currentWeather] = createResource(location, getCurrentWeather)
  const [forecast] = createResource(location, getForecast)

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
        },
        data: {
          labels: forecast()?.time as string[],
          datasets: [
            {
              label: 'T',
              data: forecast()?.temperature_2m as number[],
            },
            {
              label: 'Tw',
              data: forecast()?.WetBulb2M as number[],
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
          <Show when={!data.loading}>
            <Dropdown locations={data()} setShow={setShow} setLocation={setLocation}></Dropdown>
          </Show>
        </Show>

        <Show when={!currentWeather.loading} fallback={<>Loading...</>}>
          <h1>
            wet bulb temp: <span>{currentWeather()}</span>
          </h1>
        </Show>

        <div style='width: 800px;'>
          <canvas id='chart'></canvas>
        </div>
      </header>
    </div>
  )
}

export default App
