export enum SongSection {
  UNKNOWN = 'unknown',
  INTRO = 'intro',
  VERSE = 'verse',
  MID_VERSE = 'mid-verse',
  VERSE_2_VERSE = 'verse-2-verse',
  VERSE_2_CHORUS = 'verse-2-chorus',
  CHORUS = 'chorus',
  MID_CHORUS = 'mid-chorus',
  CHORUS_2_CHORUS = 'chorus-2-chorus',
  CHORUS_2_VERSE = 'chorus-2-verse',
  CHORUS_2_BRIDGE = 'chorus-2-bridge',
  BRIDGE = 'bridge',
  MID_BRIDGE = 'mid-bridge',
  BRIDGE_2_BRIDGE = 'bridge-2-bridge',
  BRIDGE_2_CHORUS = 'bridge-2-bridge',
  OUTRO = 'outro',
}

const SongSections = new Map<
  SongSection,
  { startBar: number; duration: number }
>([
  [SongSection.INTRO, { startBar: 0, duration: 1 }],
  [SongSection.VERSE, { startBar: 1, duration: 4 }],
  [SongSection.MID_VERSE, { startBar: 5, duration: 3 }],
  [SongSection.VERSE_2_VERSE, { startBar: 8, duration: 1 }],
  [SongSection.VERSE_2_CHORUS, { startBar: 24, duration: 1 }],
  [SongSection.CHORUS, { startBar: 25, duration: 4 }],
  [SongSection.MID_CHORUS, { startBar: 29, duration: 3 }],
  [SongSection.CHORUS_2_CHORUS, { startBar: 32, duration: 1 }],
  [SongSection.CHORUS_2_VERSE, { startBar: 40, duration: 1 }],
  [SongSection.CHORUS_2_BRIDGE, { startBar: 72, duration: 1 }],
  [SongSection.BRIDGE, { startBar: 73, duration: 4 }],
  [SongSection.MID_BRIDGE, { startBar: 85, duration: 3 }],
  [SongSection.BRIDGE_2_CHORUS, { startBar: 88, duration: 1 }],
  [SongSection.OUTRO, { startBar: 104, duration: 2 }],
]);

interface SongIface {
  name: string;
  buffer: AudioBuffer;
  tempo?: number;
}

export class Song implements SongIface {
  name: string;
  readonly buffer: AudioBuffer;
  tempo: number;

  readonly bps: number;
  readonly barDuration: number;

  constructor(builder: SongIface) {
    this.name = builder.name || 'Unknown';
    this.buffer = builder.buffer;
    this.tempo = builder.tempo || 100;

    this.bps = this.tempo / 60;
    this.barDuration = 4 / this.bps;
  }

  getSection(ctx: AudioContext, section: SongSection): AudioBuffer {
    const duration = this.getSectionDuration(section);
    const startTime = this.getSectionStartTime(section);
    const offset = startTime * this.buffer.sampleRate;
    const sampleDuration = duration * this.buffer.sampleRate;

    const subBuffer = ctx.createBuffer(
      this.buffer.numberOfChannels,
      sampleDuration,
      this.buffer.sampleRate
    );

    // Copy the data from the original buffer to the sub-buffer
    for (let channel = 0; channel < this.buffer.numberOfChannels; channel++) {
      const sourceData = this.buffer.getChannelData(channel);
      const targetData = subBuffer.getChannelData(channel);
      targetData.set(sourceData.subarray(offset, offset + subBuffer.length));
    }
    return subBuffer;
  }

  private getSectionStartTime(section: SongSection): number {
    const sectionData = SongSections.get(section);
    if (!sectionData) {
      throw new Error('Invalid section');
    }
    return sectionData.startBar * this.barDuration;
  }

  private getSectionDuration(section: SongSection): number {
    const sectionData = SongSections.get(section);
    if (!sectionData) {
      throw new Error('Invalid section');
    }
    return sectionData.duration * this.barDuration;
  }
}
