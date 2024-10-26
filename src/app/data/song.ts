export enum SongSectionType {
  UNKNOWN = 'unknown',
  INTRO = 'intro',
  VERSE = 'verse',
  CHORUS = 'chorus',
  BRIDGE = 'bridge',
  OUTRO = 'outro',
}

export enum ParticleType {
  UNKNOWN = 'unknown',
  INTRO = 'intro',
  VERSE = 'verse',
  VERSE_END = 'verse_end',
  MID_VERSE = 'mid-verse',
  VERSE_2_VERSE = 'verse-2-verse',
  VERSE_2_CHORUS = 'verse-2-chorus',
  CHORUS = 'chorus',
  CHORUS_END = 'chorus_end',
  MID_CHORUS = 'mid-chorus',
  CHORUS_2_CHORUS = 'chorus-2-chorus',
  CHORUS_2_VERSE = 'chorus-2-verse',
  CHORUS_2_BRIDGE = 'chorus-2-bridge',
  BRIDGE = 'bridge',
  BRIDGE_END = 'bridge_end',
  MID_BRIDGE = 'mid-bridge',
  BRIDGE_2_BRIDGE = 'bridge-2-bridge',
  BRIDGE_2_CHORUS = 'bridge-2-bridge',
  OUTRO = 'outro',
}

interface SongParticleInfo {
  startBar: number;
  duration: number;
  chords: string[];
};

const MAIN_CHORDS = ['C', 'G', 'Am', 'F'];
const BRIDGE_CHORDS = ['D#', 'A#', 'Cm', 'G#'];

export const jjazzlab_particles = new Map<ParticleType, SongParticleInfo>([
  [ParticleType.INTRO, { startBar: 1, duration: 1, chords: ['C'] }],
  [ParticleType.VERSE, { startBar: 2, duration: 4, chords: MAIN_CHORDS }],
  [
    ParticleType.MID_VERSE,
    { startBar: 6, duration: 3, chords: MAIN_CHORDS.slice(0, 2) },
  ],
  [
    ParticleType.VERSE_2_VERSE,
    { startBar: 9, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.VERSE_2_CHORUS,
    { startBar: 25, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [ParticleType.CHORUS, { startBar: 26, duration: 4, chords: MAIN_CHORDS }],
  [
    ParticleType.MID_CHORUS,
    { startBar: 30, duration: 3, chords: MAIN_CHORDS.slice(0, 2) },
  ],
  [
    ParticleType.CHORUS_2_CHORUS,
    { startBar: 33, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.CHORUS_2_VERSE,
    { startBar: 41, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.CHORUS_2_BRIDGE,
    { startBar: 73, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [ParticleType.BRIDGE, { startBar: 74, duration: 4, chords: BRIDGE_CHORDS }],
  [
    ParticleType.MID_BRIDGE,
    { startBar: 86, duration: 3, chords: BRIDGE_CHORDS.slice(0, 2) },
  ],
  [
    ParticleType.BRIDGE_2_CHORUS,
    { startBar: 89, duration: 1, chords: BRIDGE_CHORDS.slice(-1) },
  ],
  [ParticleType.OUTRO, { startBar: 105, duration: 2, chords: ['F', 'C'] }],
  [
    ParticleType.VERSE_END,
    { startBar: 5, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.CHORUS_END,
    { startBar: 29, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.BRIDGE_END,
    { startBar: 77, duration: 1, chords: BRIDGE_CHORDS.slice(-1) },
  ],
]);

export const biab_particles = new Map<ParticleType, SongParticleInfo>([
  [ParticleType.INTRO, { startBar: 1, duration: 8, chords: ['C'] }],
  [ParticleType.VERSE, { startBar: 9, duration: 4, chords: MAIN_CHORDS }],
  [
    ParticleType.MID_VERSE,
    { startBar: 9, duration: 3, chords: MAIN_CHORDS.slice(0, 2) },
  ],
  [
    ParticleType.VERSE_2_VERSE,
    { startBar: 16, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.VERSE_2_CHORUS,
    { startBar: 24, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [ParticleType.CHORUS, { startBar: 25, duration: 4, chords: MAIN_CHORDS }],
  [
    ParticleType.MID_CHORUS,
    { startBar: 25, duration: 3, chords: MAIN_CHORDS.slice(0, 2) },
  ],
  [
    ParticleType.CHORUS_2_CHORUS,
    { startBar: 32, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.CHORUS_2_VERSE,
    { startBar: 40, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.CHORUS_2_BRIDGE,
    { startBar: 56, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [ParticleType.BRIDGE, { startBar: 57, duration: 4, chords: BRIDGE_CHORDS }],
  [
    ParticleType.MID_BRIDGE,
    { startBar: 57, duration: 3, chords: BRIDGE_CHORDS.slice(0, 2) },
  ],
  [
    ParticleType.BRIDGE_2_CHORUS,
    { startBar: 72, duration: 1, chords: BRIDGE_CHORDS.slice(-1) },
  ],
  [ParticleType.OUTRO, { startBar: 81, duration: 2, chords: ['F', 'C'] }],
  [
    ParticleType.VERSE_END,
    { startBar: 12, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.CHORUS_END,
    { startBar: 28, duration: 1, chords: MAIN_CHORDS.slice(-1) },
  ],
  [
    ParticleType.BRIDGE_END,
    { startBar: 60, duration: 1, chords: BRIDGE_CHORDS.slice(-1) },
  ],
]);

// Apparently javascript introduces rounding errors even in multiplication.
// Therefore, we need to multiply by a large number, math.round it
// and then divide by the same number to fix the rounding error.
const ROUNDING_ERROR_FIXER = 1000;

interface SongIface {
  name: string;
  buffer: AudioBuffer;
  tempo?: number;

  songParticles: Map<ParticleType, SongParticleInfo>;
}

interface SongStateIface {
  section?: SongSectionType;
  particle?: ParticleType;
  nextParticle?: ParticleType;
  nextSection?: SongSectionType;
}

export class SongState implements SongStateIface {
  readonly section?: SongSectionType;
  readonly particle?: ParticleType;
  readonly nextParticle?: ParticleType;
  readonly nextSection?: SongSectionType;

  constructor(builder: SongStateIface) {
    this.section = builder.section;
    this.particle = builder.particle;
    this.nextSection = builder.nextSection;
    this.nextParticle = builder.nextParticle;
  }
}

export class Song implements SongIface {
  readonly name: string;
  readonly buffer: AudioBuffer; // This is the original, full song buffer.
  readonly tempo: number;

  readonly bps: number;
  readonly barDuration: number;

  readonly songParticles: Map<ParticleType, SongParticleInfo>;

  constructor(builder: SongIface) {
    this.name = builder.name || 'Unknown';
    this.buffer = builder.buffer;
    this.tempo = builder.tempo || 100;
    this.songParticles = builder.songParticles || biab_particles;

    this.bps = this.tempo / 60;
    this.barDuration = 4 / this.bps;
  }

  getParticle(ctx: AudioContext, particle: ParticleType): AudioBuffer {
    const duration = this.getParticleDuration(particle);
    const startTime = this.getParticleStartTime(particle);
    const offset =
      Math.round(startTime * this.buffer.sampleRate * ROUNDING_ERROR_FIXER) /
      ROUNDING_ERROR_FIXER;
    const sampleDuration =
      Math.round(duration * this.buffer.sampleRate * ROUNDING_ERROR_FIXER) /
      ROUNDING_ERROR_FIXER;

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

  increaseStep(state: SongState): SongState {
    if (!state.section || state.section === SongSectionType.UNKNOWN) {
      throw new Error('Invalid state, no section.');
    }

    if (!state.nextSection || state.nextSection === SongSectionType.UNKNOWN) {
      // Loop the same section. Simply switch the particles.
      return new SongState({
        section: state.section,
        particle: state.nextParticle,
        nextParticle: state.particle,
      });
    }
    if (state.nextSection === SongSectionType.OUTRO) {
      return new SongState({}); // We're done.
    }
    if (state.particle === ParticleType.UNKNOWN) {
      // It's not currently playing.
      return new SongState({
        section: state.section,
        particle: state.nextParticle,
        nextParticle: this.initialParticle(state.nextSection),
        nextSection: state.nextSection,
      });
    }
    if (
      state.particle === this.initialParticle(state.section) &&
      state.particle !== this.endParticle(state.section)
    ) {
      // We need to move to the next particle of the same section with a
      // transition
      return new SongState({
        section: state.section,
        particle: state.nextParticle,
        nextParticle: this.initialParticle(state.nextSection),
        nextSection: state.nextSection,
      });
    }
    // We need to move to the next section
    return new SongState({
      section: state.nextSection,
      particle: state.nextParticle,
      nextParticle: this.endParticle(state.nextSection),
    });
  }

  updateNextSection(state: SongState, nextSection: SongSectionType): SongState {
    const songStateConfig = {
      section: state.section,
      particle: state.particle,
      nextSection,
    };
    if (
      !state.section ||
      state.section === SongSectionType.UNKNOWN ||
      !state.particle ||
      state.particle === ParticleType.UNKNOWN
    ) {
      throw new Error('Invalid initial state to update next section');
    }
    if (state.particle === this.endParticle(state.section)) {
      return new SongState({
        ...songStateConfig,
        nextParticle: this.initialParticle(nextSection),
      });
    }
    return new SongState({
      ...songStateConfig,
      nextParticle: this.transitionParticle(state.section, nextSection),
    });
  }

  private transitionParticle(
    from: SongSectionType,
    to: SongSectionType
  ): ParticleType {
    if (from === SongSectionType.INTRO && to === SongSectionType.VERSE) {
      return ParticleType.INTRO;
    }
    if (from === SongSectionType.VERSE && to === SongSectionType.VERSE) {
      return ParticleType.VERSE_2_VERSE;
    }
    if (from === SongSectionType.VERSE && to === SongSectionType.CHORUS) {
      return ParticleType.VERSE_2_CHORUS;
    }
    if (from === SongSectionType.CHORUS && to === SongSectionType.CHORUS) {
      return ParticleType.CHORUS_2_CHORUS;
    }
    if (from === SongSectionType.CHORUS && to === SongSectionType.VERSE) {
      return ParticleType.CHORUS_2_VERSE;
    }
    if (from === SongSectionType.CHORUS && to === SongSectionType.BRIDGE) {
      return ParticleType.CHORUS_2_BRIDGE;
    }
    if (from === SongSectionType.BRIDGE && to === SongSectionType.BRIDGE) {
      return ParticleType.BRIDGE_2_BRIDGE;
    }
    if (from === SongSectionType.BRIDGE && to === SongSectionType.CHORUS) {
      return ParticleType.BRIDGE_2_CHORUS;
    }
    if (from === SongSectionType.CHORUS && to === SongSectionType.OUTRO) {
      return ParticleType.OUTRO;
    }
    throw new Error(`Invalid transition from ${from} to ${to}`);
  }

  private initialParticle(section: SongSectionType): ParticleType {
    switch (section) {
      case SongSectionType.INTRO:
        return ParticleType.INTRO;
      case SongSectionType.VERSE:
        return ParticleType.MID_VERSE;
      case SongSectionType.CHORUS:
        return ParticleType.MID_CHORUS;
      case SongSectionType.BRIDGE:
        return ParticleType.MID_BRIDGE;
      case SongSectionType.OUTRO:
        return ParticleType.OUTRO;
      default:
        throw new Error('Invalid section');
    }
  }

  private endParticle(section: SongSectionType): ParticleType {
    switch (section) {
      case SongSectionType.VERSE:
        return ParticleType.VERSE_END;
      case SongSectionType.CHORUS:
        return ParticleType.CHORUS_END;
      case SongSectionType.BRIDGE:
        return ParticleType.BRIDGE_END;
      case SongSectionType.OUTRO:
        return ParticleType.OUTRO;
      case SongSectionType.INTRO:
        return ParticleType.INTRO;
      default:
        throw new Error('Invalid section');
    }
  }

  private getParticleStartTime(particle: ParticleType): number {
    const particleData = this.songParticles.get(particle);
    if (!particleData) {
      throw new Error('Invalid particle');
    }
    return (
      Math.round(
        (particleData.startBar - 1) * this.barDuration * ROUNDING_ERROR_FIXER
      ) / ROUNDING_ERROR_FIXER
    );
  }

  private getParticleDuration(particle: ParticleType): number {
    const particleData = this.songParticles.get(particle);
    if (!particleData) {
      throw new Error('Invalid particle');
    }
    return (
      Math.round(
        particleData.duration * this.barDuration * ROUNDING_ERROR_FIXER
      ) / ROUNDING_ERROR_FIXER
    );
  }
}
