declare namespace AudioPlayer {
  interface SMFBuffer {
    smf: SMF
  }

  interface SMFSourceNode extends AudioNode {
    buffer: SMFBuffer
    start(when?: number, offset?: number, duration?: number)
    stop(when?: number)
  }

  interface SMF {
    header: SMFHeader
    tracks: SMFTrack[]
  }

  interface SMFHeader {
    PPQ: number
    bpm: number
    timeSignature: number[]
  }

  interface SMFTrack {
    channelNumber: number
    controlChanges: SMFControl[]
    id: number
    instrumentNumber: number
    name: string
    notes: SMFNote[]
      duration: number
      instrument: null
      instrumentFamily: null
      isPercussion: boolean
      length: number
      noteOffs: SMFNoteEvent[]
      noteOns: SMFNoteEvent[]
      startTime: number
  }

  interface SMFControl {
    number: number
    time: number
    value: number
      name: string
  }

  interface SMFNote {
    duration: number
    midi: number
    time: number
    velocity: number
      name: string
      noteOff: number
      noteOn: number
  }

  interface SMFNoteEvent {
    midi: number
    name: string
    time: number
  }
}
