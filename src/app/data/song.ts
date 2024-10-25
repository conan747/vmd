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

const SongParticles = new Map<
  ParticleType,
  SongParticleInfo
>([
  [ParticleType.INTRO, { startBar: 0, duration: 1 , chords: ['C']}],
  // [ParticleType.VERSE, { startBar: 1, duration: 4 , chords: MAIN_CHORDS}],
  [ParticleType.MID_VERSE, { startBar: 5, duration: 3, chords: MAIN_CHORDS.slice(0, 2) }],
  [ParticleType.VERSE_2_VERSE, { startBar: 8, duration: 1, chords: MAIN_CHORDS.slice(-1) }],
  [ParticleType.VERSE_2_CHORUS, { startBar: 24, duration: 1, chords: MAIN_CHORDS.slice(-1) }],
  // [ParticleType.CHORUS, { startBar: 25, duration: 4, chords: MAIN_CHORDS }],
  [ParticleType.MID_CHORUS, { startBar: 29, duration: 3 , chords: MAIN_CHORDS.slice(0, 2)}],
  [ParticleType.CHORUS_2_CHORUS, { startBar: 32, duration: 1, chords: MAIN_CHORDS.slice(-1) }],
  [ParticleType.CHORUS_2_VERSE, { startBar: 40, duration: 1, chords: MAIN_CHORDS.slice(-1) }],
  [ParticleType.CHORUS_2_BRIDGE, { startBar: 72, duration: 1 , chords: MAIN_CHORDS.slice(-1)}],
  // [ParticleType.BRIDGE, { startBar: 73, duration: 4, chords: BRIDGE_CHORDS }],
  [ParticleType.MID_BRIDGE, { startBar: 85, duration: 3, chords: BRIDGE_CHORDS.slice(0, 2) }],
  [ParticleType.BRIDGE_2_CHORUS, { startBar: 88, duration: 1, chords: BRIDGE_CHORDS.slice(-1) }],
  [ParticleType.OUTRO, { startBar: 104, duration: 2, chords: ['F', 'C'] }],
  [ParticleType.VERSE_END, { startBar: 4, duration: 1, chords: MAIN_CHORDS.slice(-1)  }],
  [ParticleType.CHORUS_END, { startBar: 28, duration: 1, chords: MAIN_CHORDS.slice(-1) }],
  [ParticleType.BRIDGE_END, { startBar: 76, duration: 1, chords: BRIDGE_CHORDS.slice(-1) }],
]);

interface SongSectionIface {
  type: SongSectionType;
  mainParticle: SongParticleClass;
  mainEnd: SongParticleClass;
}

class SongSectionClass {
  readonly type: SongSectionType;
  readonly mainParticle: SongParticleClass;
  readonly mainEnd: SongParticleClass;
  readonly transitionTo: Map<SongSectionType, SongParticleClass>;

  constructor(builder: SongSectionIface) {
    this.type = builder.type;
    this.mainParticle = builder.mainParticle;
    this.mainEnd = builder.mainEnd;

    this.transitionTo = new Map();
  }

  transitionParticleTo(to: SongSectionType): SongParticleClass {
    const particle = this.transitionTo.get(to);
    if (!particle) {
      throw new Error('Invalid transition from ' + this.type + ' to ' + to);
    }
    return particle;
  }
}

interface SongParticleInfo2 {
  type: ParticleType;
  startBar: number;
  bars: number;
  chords: string[];
  // These are not super necessary.
  barDuration: number;
  isInitialParticle: boolean;
  isEndParticle: boolean;
}

class SongParticleClass implements SongParticleInfo2 {
  readonly type: ParticleType;
  readonly startBar: number;
  readonly bars: number;
  readonly chords: string[];
  readonly barDuration: number;
  readonly isInitialParticle: boolean;
  readonly isEndParticle: boolean;

  // Computed
  readonly duration: number;
  readonly startTime: number;

  constructor(builder: SongParticleInfo2) {
    this.type = builder.type;
    this.startBar = builder.startBar;
    this.bars = builder.bars;
    this.chords = builder.chords;
    this.barDuration = builder.barDuration;
    this.isInitialParticle = builder.isInitialParticle;
    this.isEndParticle = builder.isEndParticle;

    // Computed
    this.duration =
      Math.round(this.bars * this.barDuration * ROUNDING_ERROR_FIXER) /
      ROUNDING_ERROR_FIXER;
    this.startTime =
      Math.round(this.startBar * this.barDuration * ROUNDING_ERROR_FIXER) /
      ROUNDING_ERROR_FIXER;
  }
}

// Apparently javascript introduces rounding errors even in multiplication.
// Therefore, we need to multiply by a large number, math.round it
// and then divide by the same number to fix the rounding error.
const ROUNDING_ERROR_FIXER = 1000;

interface SongIface {
  name: string;
  buffer: AudioBuffer;
  tempo?: number;
  sections: Map<SongSectionType, SongSectionClass>;
}

interface SongStateIface {
  section?: SongSectionClass;
  particle?: SongParticleClass;
  nextParticle?: SongParticleClass;
  nextSection?: SongSectionClass;
}

export class SongState implements SongStateIface {
  readonly section?: SongSectionClass;
  readonly particle?: SongParticleClass;
  readonly nextParticle?: SongParticleClass;
  readonly nextSection?: SongSectionClass;

  constructor(builder: SongStateIface) {
    this.section = builder.section;
    this.particle = builder.particle;
    this.nextSection = builder.nextSection;
    this.nextParticle = builder.nextParticle;
  }
}

export class Song implements SongIface {
  readonly name: string;
  readonly buffer: AudioBuffer;
  readonly tempo: number;

  readonly bps: number;
  readonly barDuration: number;

  readonly sections: Map<SongSectionType, SongSectionClass>;

  constructor(builder: SongIface) {
    this.name = builder.name || 'Unknown';
    this.buffer = builder.buffer;
    this.tempo = builder.tempo || 100;

    this.bps = this.tempo / 60;
    this.barDuration = 4 / this.bps;
    this.sections = builder.sections;
  }

  getParticleAudio(
    ctx: AudioContext,
    particle: SongParticleClass
  ): AudioBuffer {
    const offset =
      Math.round(
        particle.startTime * this.buffer.sampleRate * ROUNDING_ERROR_FIXER
      ) / ROUNDING_ERROR_FIXER;
    const sampleDuration =
      Math.round(
        particle.duration * this.buffer.sampleRate * ROUNDING_ERROR_FIXER
      ) / ROUNDING_ERROR_FIXER;

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
    // TODO: Check if we can assume defined state always.
    if (!state.section || state.section?.type === SongSectionType.UNKNOWN) {
      throw new Error('Invalid state, no section.');
    }

    if (
      !state.nextSection ||
      state.nextSection?.type === SongSectionType.UNKNOWN
    ) {
      // Loop the same section. Simply switch the particles.
      return new SongState({
        section: state.section,
        particle: state.nextParticle,
        nextParticle: state.particle,
      });
    }
    if (state.nextSection?.type === SongSectionType.OUTRO) {
      return new SongState({}); // We're done.
    }

    if (
      state.particle?.type === ParticleType.UNKNOWN ||
      state.particle?.isInitialParticle
    ) {
      // We need to move to the next particle of the same section with a
      // transition to some other section.
      return new SongState({
        section: state.section,
        particle: state.nextParticle,
        nextParticle: state.nextSection.mainParticle,
        nextSection: state.nextSection,
      });
    }
    // We need to move to the next section
    return new SongState({
      section: state.nextSection,
      particle: state.nextParticle,
      nextParticle: state.nextSection.mainEnd,
    });
  }

  updateNextSection(
    state: SongState,
    nextSectionType: SongSectionType
  ): SongState {
    const nextSection = this.sections.get(nextSectionType);
    if (!nextSection) {
      // This should never happen.
      throw new Error('Invalid next section: ' + nextSectionType);
    }
    const songStateConfig = {
      section: state.section,
      particle: state.particle,
      nextSection,
    };
    if (
      !state.section ||
      state.section?.type === SongSectionType.UNKNOWN ||
      !state.particle ||
      state.particle?.type === ParticleType.UNKNOWN
    ) {
      throw new Error('Invalid initial state to update next section');
    }
    if (state.particle.isEndParticle) {
      return new SongState({
        ...songStateConfig,
        nextParticle: nextSection?.mainParticle,
      });
    }
    return new SongState({
      ...songStateConfig,
      nextParticle: state.section.transitionParticleTo(nextSection.type),
    });
  }

  getInitialState(introTo: SongSectionType = SongSectionType.VERSE): SongState {
    const introSection = this.sections.get(SongSectionType.INTRO);
    return new SongState({
      section: introSection,
      particle: introSection?.mainParticle,
      nextParticle: introSection?.mainParticle,
      nextSection: this.sections.get(introTo),
    });
  }

  // private transitionParticle(
  //   from: SongSectionType,
  //   to: SongSectionType
  // ): ParticleType {
  //   if (from === SongSectionType.INTRO && to === SongSectionType.VERSE) {
  //     return ParticleType.INTRO;
  //   }
  //   if (from === SongSectionType.VERSE && to === SongSectionType.VERSE) {
  //     return ParticleType.VERSE_2_VERSE;
  //   }
  //   if (from === SongSectionType.VERSE && to === SongSectionType.CHORUS) {
  //     return ParticleType.VERSE_2_CHORUS;
  //   }
  //   if (from === SongSectionType.CHORUS && to === SongSectionType.CHORUS) {
  //     return ParticleType.CHORUS_2_CHORUS;
  //   }
  //   if (from === SongSectionType.CHORUS && to === SongSectionType.VERSE) {
  //     return ParticleType.CHORUS_2_VERSE;
  //   }
  //   if (from === SongSectionType.CHORUS && to === SongSectionType.BRIDGE) {
  //     return ParticleType.CHORUS_2_BRIDGE;
  //   }
  //   if (from === SongSectionType.BRIDGE && to === SongSectionType.BRIDGE) {
  //     return ParticleType.BRIDGE_2_BRIDGE;
  //   }
  //   if (from === SongSectionType.BRIDGE && to === SongSectionType.CHORUS) {
  //     return ParticleType.BRIDGE_2_CHORUS;
  //   }
  //   if (from === SongSectionType.CHORUS && to === SongSectionType.OUTRO) {
  //     return ParticleType.OUTRO;
  //   }
  //   throw new Error(`Invalid transition from ${from} to ${to}`);
  // }

  // private initialParticle(section: SongSectionType): ParticleType {
  //   switch (section) {
  //     case SongSectionType.INTRO:
  //       return ParticleType.INTRO;
  //     case SongSectionType.VERSE:
  //       return ParticleType.MID_VERSE;
  //     case SongSectionType.CHORUS:
  //       return ParticleType.MID_CHORUS;
  //     case SongSectionType.BRIDGE:
  //       return ParticleType.MID_BRIDGE;
  //     case SongSectionType.OUTRO:
  //       return ParticleType.OUTRO;
  //     default:
  //       throw new Error('Invalid section');
  //   }
  // }

  // private endParticle(section: SongSectionType): ParticleType {
  //   switch (section) {
  //     case SongSectionType.VERSE:
  //       return ParticleType.VERSE_END;
  //     case SongSectionType.CHORUS:
  //       return ParticleType.CHORUS_END;
  //     case SongSectionType.BRIDGE:
  //       return ParticleType.BRIDGE_END;
  //     case SongSectionType.OUTRO:
  //       return ParticleType.OUTRO;
  //     case SongSectionType.INTRO:
  //       return ParticleType.INTRO;
  //     default:
  //       throw new Error('Invalid section');
  //   }
  // }

  private getParticleStartTime(particle: ParticleType): number {
    const particleData = SongParticles.get(particle);
    if (!particleData) {
      throw new Error('Invalid particle');
    }
    return (
      Math.round(
        particleData.startBar * this.barDuration * ROUNDING_ERROR_FIXER
      ) / ROUNDING_ERROR_FIXER
    );
  }

  private getParticleDuration(particle: ParticleType): number {
    const particleData = SongParticles.get(particle);
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
