import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayerService } from './player.service';
import { ParticleType } from './data/song';
import { inject } from '@angular/core';
import { SongSectionType } from './data/song';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly playerService: PlayerService = inject(PlayerService);
  protected readonly ParticleType = ParticleType;
  protected readonly SongSectionType = SongSectionType;
  readonly songState$ = this.playerService.songState$;

  readonly availableSections = [
    SongSectionType.VERSE,
    SongSectionType.CHORUS,
    SongSectionType.BRIDGE,
    SongSectionType.OUTRO,
  ];

  ngOnInit() {
    this.loadSong();
  }

  loadSong() {
    this.playerService.loadSong('/assets/sad_jazz_full.mp3');
  }

  play(section: SongSectionType, fromIntro = false) {
    if (fromIntro) {
      this.playerService.introTo(section);
    } else {
      this.playerService.enqueue(section);
    }
  }

  stop() {
    this.playerService.stop();
  }
}
