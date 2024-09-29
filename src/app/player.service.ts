import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { Song, SongSection } from './data/song';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly http = inject(HttpClient);
  private audioContext: AudioContext = new AudioContext();
  private song?: Song;
  playing = false;

  readonly section$ = new Subject<SongSection | null>();
  readonly nextSection$ = new Subject<SongSection | null>();

  private next?: { section: SongSection; buffer: AudioBufferSourceNode };

  async loadSong(url: string) {
    const response = await firstValueFrom(
      this.http.get(url, { responseType: 'arraybuffer' })
    );
    const audioBuffer = await this.audioContext.decodeAudioData(response);
    this.song = new Song({ name: url, buffer: audioBuffer, tempo: 100 });
  }

  enqueue(section: SongSection) {
    if (!this.song) {
      throw new Error('No song loaded');
    }
    this.nextSection$.next(section);
    this.next = { section, buffer: this.audioContext.createBufferSource() };
    this.next.buffer.buffer = this.song.getSection(this.audioContext, section);
    this.next.buffer.connect(this.audioContext.destination);
    this.next.buffer.onended = () => this.playNextOnQueue();
    if (!this.playing) {
      return this.playNextOnQueue();
    }
  }

  private playNextOnQueue() {
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
  }

  stop() {
    this.audioContext.close();
    this.audioContext = new AudioContext();
    this.section$.next(null);
  }
}
