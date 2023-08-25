import { For, Setter, Show } from 'solid-js'
import { LocationResult } from '../services/api.service'
import styles from '../App.module.css'
type DropdownProps = {
  locations: LocationResult[] | undefined
  setLocation: Setter<LocationResult | undefined>
  setShow: Setter<boolean>
}

export function Dropdown({ setShow, setLocation, locations }: DropdownProps) {
  return (
    <div class={styles.DropdownContainer}>
      <ul class={styles.Dropdown}>
        <For each={locations}>
          {(location) => (
            <li
              onClick={() => {
                setLocation(location)
                setShow(false)
              }}
            >
              <p>
                {location.name} - {location.country}
              </p>
              <small>
                <Show when={location.admin1}>{location.admin1}</Show>
                <Show when={location.admin2}> - {location.admin2}</Show>
                <Show when={location.admin3}> - {location.admin3}</Show>
              </small>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
