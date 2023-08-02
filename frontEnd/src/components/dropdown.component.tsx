import { Setter, createSignal, Show, For } from 'solid-js'
import { SearchInputProps } from './search-input.component'
import { LocationResult } from '../services/api.service'

type DropdownProps = {
  locations: LocationResult[] | undefined
  setLocation: Setter<LocationResult>
  setShow: Setter<boolean>
}

export function Dropdown({ setShow, setLocation, locations }: DropdownProps) {
  return (
    <ul>
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
