import { Setter, createSignal } from 'solid-js'
import styles from '../App.module.css'
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
      <label for='title'>Search Location</label>
      <form class={styles.Input}>
        <input
          id='title'
          value={input()}
          onInput={(e) => {
            setInput(e.currentTarget.value)
          }}
        />

        <button type='submit' onClick={clickHandler}>
          Search
        </button>
      </form>
    </>
  )
}
