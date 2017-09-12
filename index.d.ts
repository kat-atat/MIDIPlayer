declare interface AudioPlugin {
  paused: boolean
  currentTime: number
  duration: number

  play(): Promise<void>
  pause(): void
  load(data: any): boolean
}
