import { Show, createEffect, createResource, createSignal, type Component } from 'solid-js'
import { SearchInput } from './components/search-input.component'

import { CategoryScale, Chart, Legend, LineController, LineElement, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import annotationPlugin from 'chartjs-plugin-annotation'
import styles from './App.module.css'
import { Dropdown } from './components/dropdown.component'
import { LocationResult, getForecast, searchLocations } from './services/api.service'
import { calcCurrentTw, setChartOptions } from './services/utils.service'

const App: Component = () => {
  const [query, setQuery] = createSignal('')
  const [locations] = createResource(query, searchLocations)
  const [location, setLocation] = createSignal<LocationResult>()
  const [show, setShow] = createSignal<boolean>(true)
  const [forecast] = createResource(location, getForecast)

  const actualTw = function () {
    const results = forecast()
    if (!results) return ''
    return calcCurrentTw(results)
  }

  createEffect(() => {
    query()
    setShow(true)
  })

  createEffect(() => {
    const result = forecast()
    if (result) {
      Chart.register(annotationPlugin)
      Chart.register(CategoryScale)
      Chart.register(LineController)
      Chart.register(TimeScale)
      Chart.register(LinearScale)
      Chart.register(PointElement)
      Chart.register(LineElement)
      Chart.register(Legend)
      Chart.register(Tooltip)
      new Chart(document.getElementById('chart') as HTMLCanvasElement, setChartOptions(result))
    }
  })

  return (
    <div class={styles.App}>
      <div class={styles.Content}>
        <SearchInput setQuery={setQuery} />
        <Show when={show()}>
          <Show when={!locations.loading}>
            <Dropdown locations={locations()} setShow={setShow} setLocation={setLocation}></Dropdown>
          </Show>
        </Show>
        <Show when={!forecast.loading && forecast()} fallback={<></>}>
          <h3>
            Current Tw: <span>{actualTw()} °C</span>
          </h3>

          <div class={styles.Chart}>
            <canvas id='chart'></canvas>
          </div>
        </Show>
      </div>
      <footer>
        <p>
          Thanks to <a href='https://open-meteo.com/'>Open-Meteo</a> for the data!
          <span>
            {' '}
            - Make with love by <a href='https://github.com/Isma1306'>Isma</a>
          </span>
        </p>
      </footer>
    </div>
  )
}

export default App
