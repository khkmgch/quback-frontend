import { useState } from 'react'

export const useToggle = () => {
  const [state, setState] = useState<boolean>(false)
  const toggle = () => setState((prev) => !prev)
  return { state, setState, toggle }
}
