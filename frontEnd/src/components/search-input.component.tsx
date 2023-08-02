import { For, Setter, Show, createEffect, createResource, createSignal } from 'solid-js'
import { searchLocations } from '../services/api.service'

export interface SearchInputProps {
  setQuery: Setter<string>
}

export function SearchInput(props: SearchInputProps) {
  const [input, setInput] = createSignal('')
  const clickHandler = function (event: Event) {
    event.preventDefault()
    props.setQuery(input())
  }

  return (
    <>
      <form>
        <div>
          <label for='title'>Search Location</label>
          <input
            id='title'
            value={input()}
            onInput={(e) => {
              setInput(e.currentTarget.value)
            }}
          />
        </div>
        <button type='submit' onClick={clickHandler}>
          Search
        </button>
      </form>
    </>
  )
}
