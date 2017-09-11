declare interface AudioPlugin {
  paused: boolean
  played: TimeRanges
  currentTime: number
  duration: number

  play(): Promise<void>
  ontimeupdate(this: HTMLElement, ev: Event): any
  pause(): void
  load(data: any): boolean
  remove(): void
}
