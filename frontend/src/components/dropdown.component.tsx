import { For, Setter } from 'solid-js'
import { LocationResult } from '../services/api.service'
import styles from '../App.module.css'
type DropdownProps = {
  locations: LocationResult[] | undefined
  setLocation: Setter<LocationResult | undefined>
  setShow: Setter<boolean>
}

export function Dropdown({ setShow, setLocation, locations }: DropdownProps) {
  return (
    <ul class={styles.Dropdown}>
      <For each={locations}>
        {(location) => (
          <li
            onClick={() => {
              setLocation(location)
              setShow(false)
            }}
          >
            {location.name} - {location.country}
          </li>
        )}
      </For>
    </ul>
  )
}
