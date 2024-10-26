import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { Song, ParticleType, SongSectionType } from './data/song';
import { inject } from '@angular/core';
import { SongState, biab_particles, jjazzlab_particles } from './data/song';

const BIAB_URL =
  'https://storage.googleapis.com/vmd-assets/ballad_good_demo_Render.mp3';
const JJAZZLAB_URL =
  'https://storage.googleapis.com/vmd-assets/sad_jazz_full.mp3';

const BIAB_SONG_INFO = {
  name: 'Ballad Good Demo',
  tempo: 90,
  songParticles: biab_particles,
};

const JJAZZLAB_SONG_INFO = {
  name: 'Sad Jazz Full',
  tempo: 100,
  songParticles: jjazzlab_particles,
};

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly http = inject(HttpClient);
  private audioContext: AudioContext = new AudioContext();
  private song?: Song;
  private songState: SongState = new SongState({});

  private playing = false;

  readonly section$ = new Subject<SongSectionType | null>();
  readonly nextSection$ = new Subject<SongSectionType | null>();
  readonly songState$ = new Subject<SongState>();

  private next?: {
    particle: ParticleType;
    buffer: AudioBufferSourceNode;
    endsSection: boolean;
  };

  private nextBuffer?: AudioBufferSourceNode;

  async loadSong(song: string) {
    const url = song === 'biab' ? BIAB_URL : JJAZZLAB_URL;

    const response = await firstValueFrom(
      this.http.get(url, { responseType: 'arraybuffer' })
    );
    const audioBuffer = await this.audioContext.decodeAudioData(response);
    const songInfo = song === 'biab' ? BIAB_SONG_INFO : JJAZZLAB_SONG_INFO;
    this.song = new Song({
      ...songInfo,
      buffer: audioBuffer,
    });
    this.songState = new SongState({});
    this.songState$.next(this.songState);
  }

  introTo(section: SongSectionType) {
    if (!this.song) {
      throw new Error('No song loaded');
    }

    this.songState = new SongState({
      section: SongSectionType.INTRO,
      particle: ParticleType.UNKNOWN,
      nextParticle: ParticleType.INTRO,
      nextSection: section,
    });
    this.updateBuffer();
    this.step();
  }

  enqueue(section: SongSectionType) {
    if (!this.song) {
      throw new Error('No song loaded');
    }

    this.songState = this.song.updateNextSection(this.songState, section);
    this.songState$.next(this.songState);
    this.updateBuffer();

    if (!this.playing) {
      return this.step();
    }
  }

  private updateBuffer() {
    if (!this.song) {
      throw new Error('No song loaded');
    }
    if (
      !this.songState.nextParticle ||
      this.songState.nextParticle === ParticleType.UNKNOWN
    ) {
      throw new Error('Invalid state, no next particle.');
    }
    this.nextBuffer = this.audioContext.createBufferSource();
    this.nextBuffer.buffer = this.song.getParticle(
      this.audioContext,
      this.songState.nextParticle
    );
    this.nextBuffer.connect(this.audioContext.destination);
    this.nextBuffer.onended = () => this.step();
  }

  private step() {
    if (!this.song) {
      throw new Error('No song loaded');
    }
    if (!this.nextBuffer) {
      this.playing = false;
      throw new Error('No buffer!');
    }

    this.nextBuffer.start();
    this.playing = true;

    this.songState = this.song.increaseStep(this.songState);
    this.songState$.next(this.songState);
    this.updateBuffer();
  }

  stop() {
    this.audioContext.close();
    this.audioContext = new AudioContext();
    this.section$.next(null);
  }
}
