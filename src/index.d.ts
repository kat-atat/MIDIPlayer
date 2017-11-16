declare namespace AudioPlayer {
  interface AudioPlugin {
    currentTime: number
    duration: number
    load(data: HTMLMediaElement | ArrayBuffer): Promise<AudioPlugin>
    paused: boolean
    play(): Promise<void>
    pause(): void
  }
}
