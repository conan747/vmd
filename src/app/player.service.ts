import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { Song, SongParticle, SongSection } from './data/song';
import { inject } from '@angular/core';
import { SongState } from './data/song';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly http = inject(HttpClient);
  private audioContext: AudioContext = new AudioContext();
  private song?: Song;
  private songState: SongState = new SongState({});

  private playing = false;

  readonly section$ = new Subject<SongSection | null>();
  readonly nextSection$ = new Subject<SongSection | null>();
  readonly songState$ = new Subject<SongState>();

  private next?: {
    particle: SongParticle;
    buffer: AudioBufferSourceNode;
    endsSection: boolean;
  };

  private nextBuffer?: AudioBufferSourceNode;

  async loadSong(url: string) {
    const response = await firstValueFrom(
      this.http.get(url, { responseType: 'arraybuffer' })
    );
    const audioBuffer = await this.audioContext.decodeAudioData(response);
    this.song = new Song({ name: url, buffer: audioBuffer, tempo: 100 });
    this.songState = new SongState({});
  }

  introTo(section: SongSection) {
    if (!this.song) {
      throw new Error('No song loaded');
    }

    this.songState = new SongState(
      {
        section: SongSection.INTRO,
        particle: SongParticle.UNKNOWN,
        nextParticle: SongParticle.INTRO,
        nextSection: section,
      });
    this.updateBuffer();
    this.step();
  }

  enqueue(section: SongSection) {
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
      this.songState.nextParticle === SongParticle.UNKNOWN
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

  /*   private playNextOnQueue() {
    this.nextSection$.next(null);
    if (!this.next) {
      console.log('No section queued.');
      this.playing = false;
      this.section$.next(null);
      return;
    }
    this.next.buffer.start();
    this.section$.next(this.next.section);
    this.next = undefined;
    this.playing = true;
  } */

  stop() {
    this.audioContext.close();
    this.audioContext = new AudioContext();
    this.section$.next(null);
  }
}
