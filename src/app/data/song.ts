export enum SongSection {
  UNKNOWN = 'unknown',
  INTRO = 'intro',
  VERSE = 'verse',
  CHORUS = 'chorus',
  BRIDGE = 'bridge',
  OUTRO = 'outro',
}

export enum SongParticle {
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

const SongParticles = new Map<
  SongParticle,
  { startBar: number; duration: number }
>([
  [SongParticle.INTRO, { startBar: 0, duration: 1 }],
  [SongParticle.VERSE, { startBar: 1, duration: 4 }],
  [SongParticle.MID_VERSE, { startBar: 5, duration: 3 }],
  [SongParticle.VERSE_2_VERSE, { startBar: 8, duration: 1 }],
  [SongParticle.VERSE_2_CHORUS, { startBar: 24, duration: 1 }],
  [SongParticle.CHORUS, { startBar: 25, duration: 4 }],
  [SongParticle.MID_CHORUS, { startBar: 29, duration: 3 }],
  [SongParticle.CHORUS_2_CHORUS, { startBar: 32, duration: 1 }],
  [SongParticle.CHORUS_2_VERSE, { startBar: 40, duration: 1 }],
  [SongParticle.CHORUS_2_BRIDGE, { startBar: 72, duration: 1 }],
  [SongParticle.BRIDGE, { startBar: 73, duration: 4 }],
  [SongParticle.MID_BRIDGE, { startBar: 85, duration: 3 }],
  [SongParticle.BRIDGE_2_CHORUS, { startBar: 88, duration: 1 }],
  [SongParticle.OUTRO, { startBar: 104, duration: 2 }],
  [SongParticle.VERSE_END, { startBar: 4, duration: 1 }],
  [SongParticle.CHORUS_END, { startBar: 28, duration: 1 }],
  [SongParticle.BRIDGE_END, { startBar: 76, duration: 1 }],
]);

interface SongIface {
  name: string;
  buffer: AudioBuffer;
  tempo?: number;
}

export class SongState {
  readonly section?: SongSection;
  readonly particle?: SongParticle;
  readonly nextParticle?: SongParticle;
  readonly nextSection?: SongSection;

  constructor(
    section?: SongSection,
    particle?: SongParticle,
    nextParticle?: SongParticle,
    nextSection?: SongSection
  ) {
    this.section = section;
    this.particle = particle;
    this.nextSection = nextSection;
    this.nextParticle = nextParticle;
  }
}

export class Song implements SongIface {
  readonly name: string;
  readonly buffer: AudioBuffer;
  readonly tempo: number;

  readonly bps: number;
  readonly barDuration: number;

  constructor(builder: SongIface) {
    this.name = builder.name || 'Unknown';
    this.buffer = builder.buffer;
    this.tempo = builder.tempo || 100;

    this.bps = this.tempo / 60;
    this.barDuration = 4 / this.bps;
  }

  getParticle(ctx: AudioContext, particle: SongParticle): AudioBuffer {
    const duration = this.getParticleDuration(particle);
    const startTime = this.getParticleStartTime(particle);
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

  increaseStep(state: SongState): SongState {
    if (!state.section || state.section === SongSection.UNKNOWN) {
      throw new Error('Invalid state, no section.');
    }

    const lastParticleForOldSection = this.endParticle(state.section);

    if (!state.nextSection || state.nextSection === SongSection.UNKNOWN) {
      // Loop the same section. Simply switch the particles.
      const newParticle =
        state.nextParticle === lastParticleForOldSection
          ? lastParticleForOldSection
          : this.initialParticle(state.section);
      return new SongState(state.section, state.nextParticle, newParticle);
    }
    if (state.particle === lastParticleForOldSection) {
      // We need to move to the next section
      return new SongState(
        state.nextSection,
        state.nextParticle,
        this.endParticle(state.nextSection)
      );
    }
    // We need to move to the next particle of the same section with a
    // transition
    return new SongState(
      state.section,
      state.nextParticle,
      this.initialParticle(state.nextSection),
      state.nextSection
    );
    // if (!state.particle || state.particle === SongParticle.UNKNOWN) {
    //   return new SongState(
    //     state.section,
    //     initialParticleForSection,
    //     initialParticleForSection
    //   );
    // }
    // if (state.particle === initialParticleForSection) {
    //   // We need to move to the next particle of the same section
    //   if (!state.nextSection) {
    //     // We loop the same section.
    //     return new SongState(
    //       state.section,
    //       initialParticleForSection,
    //       this.endParticle(state.section)
    //     );
    //   }
    //   // We prepare the transition to the next section.
    //   return new SongState(
    //     state.section,
    //     this.transitionParticle(state.section, state.nextSection),
    //     this.transitionParticle(state.section, state.nextSection),
    //     state.nextSection
    //   );
    // }
    // //we need to move to the next section
    // if (!state.nextSection) {
    //   // We loop the same section.
    //   return new SongState(state.section, this.endParticle(state.section));
    // }
    // return new SongState(
    //   state.nextSection,
    //   this.initialParticle(state.nextSection)
    // );
  }

  updateNextSection(state: SongState, nextSection: SongSection): SongState {
    if (
      !state.section ||
      state.section === SongSection.UNKNOWN ||
      !state.particle ||
      state.particle === SongParticle.UNKNOWN
    ) {
      const initial = this.initialParticle(nextSection);
      return new SongState(nextSection, this.endParticle(nextSection), initial);
    }
    if (state.particle === this.endParticle(state.section)) {
      return new SongState(
        state.section,
        state.particle,
        this.initialParticle(nextSection),
        nextSection
      );
    }
    return new SongState(
      state.section,
      state.particle,
      this.transitionParticle(state.section, nextSection),
      nextSection
    );
  }

  private transitionParticle(from: SongSection, to: SongSection): SongParticle {
    if (from === SongSection.INTRO && to === SongSection.VERSE) {
      return SongParticle.INTRO;
    }
    if (from === SongSection.VERSE && to === SongSection.VERSE) {
      return SongParticle.VERSE_2_VERSE;
    }
    if (from === SongSection.VERSE && to === SongSection.CHORUS) {
      return SongParticle.VERSE_2_CHORUS;
    }
    if (from === SongSection.CHORUS && to === SongSection.CHORUS) {
      return SongParticle.CHORUS_2_CHORUS;
    }
    if (from === SongSection.CHORUS && to === SongSection.VERSE) {
      return SongParticle.CHORUS_2_VERSE;
    }
    if (from === SongSection.CHORUS && to === SongSection.BRIDGE) {
      return SongParticle.CHORUS_2_BRIDGE;
    }
    if (from === SongSection.BRIDGE && to === SongSection.BRIDGE) {
      return SongParticle.BRIDGE_2_BRIDGE;
    }
    if (from === SongSection.BRIDGE && to === SongSection.CHORUS) {
      return SongParticle.BRIDGE_2_CHORUS;
    }
    throw new Error('Invalid transition');
  }

  private initialParticle(section: SongSection): SongParticle {
    switch (section) {
      case SongSection.INTRO:
        return SongParticle.INTRO;
      case SongSection.VERSE:
        return SongParticle.MID_VERSE;
      case SongSection.CHORUS:
        return SongParticle.MID_CHORUS;
      case SongSection.BRIDGE:
        return SongParticle.MID_BRIDGE;
      case SongSection.OUTRO:
        return SongParticle.OUTRO;
      default:
        throw new Error('Invalid section');
    }
  }

  private endParticle(section: SongSection): SongParticle {
    switch (section) {
      case SongSection.VERSE:
        return SongParticle.VERSE_END;
      case SongSection.CHORUS:
        return SongParticle.CHORUS_END;
      case SongSection.BRIDGE:
        return SongParticle.BRIDGE_END;
      case SongSection.OUTRO:
        return SongParticle.OUTRO;
      case SongSection.INTRO:
        return SongParticle.INTRO;
      default:
        throw new Error('Invalid section');
    }
  }

  private getParticleStartTime(particle: SongParticle): number {
    const particleData = SongParticles.get(particle);
    if (!particleData) {
      throw new Error('Invalid particle');
    }
    return particleData.startBar * this.barDuration;
  }

  private getParticleDuration(particle: SongParticle): number {
    const particleData = SongParticles.get(particle);
    if (!particleData) {
      throw new Error('Invalid particle');
    }
    return particleData.duration * this.barDuration;
  }
}
