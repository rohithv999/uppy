// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore We don't want TS to generate types for the package.json
import packageJson from '../package.json'

export type GenericState = Record<string, unknown>

export type Listener<T> = (
  prevState: T,
  nextState: T,
  patch: Partial<T>,
) => void

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore<T extends GenericState = GenericState> {
  static VERSION = packageJson.version

  public state: T = {} as T

  #callbacks = new Set<Listener<T>>()

  getState(): T {
    return this.state
  }

  setState(patch: Partial<T>): void {
    const prevState = { ...this.state }
    const nextState = { ...this.state, ...patch }

    this.state = nextState
    this.#publish(prevState, nextState, patch)
  }

  subscribe(listener: Listener<T>): () => void {
    this.#callbacks.add(listener)
    return () => {
      this.#callbacks.delete(listener)
    }
  }

  #publish(...args: Parameters<Listener<T>>): void {
    this.#callbacks.forEach((listener) => {
      listener(...args)
    })
  }
}

export default DefaultStore
