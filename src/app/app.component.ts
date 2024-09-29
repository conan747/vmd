import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlayerService } from './player.service';
import { SongSection } from './data/song';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly playerService: PlayerService = inject(PlayerService);
  protected readonly SongSection = SongSection;
  readonly section$ = this.playerService.section$;
  readonly nextSection$ = this.playerService.nextSection$;

  readonly availableSections = [
    SongSection.INTRO,
    SongSection.VERSE,
    SongSection.MID_VERSE,
    SongSection.VERSE_2_VERSE,
    SongSection.VERSE_2_CHORUS,
    SongSection.CHORUS,
    SongSection.MID_CHORUS,
    SongSection.CHORUS_2_CHORUS,
    SongSection.CHORUS_2_VERSE,
    SongSection.CHORUS_2_BRIDGE,
    SongSection.BRIDGE,
    SongSection.MID_BRIDGE,
    SongSection.BRIDGE_2_CHORUS,
    SongSection.OUTRO,
  ];

  loadSong() {
    this.playerService.loadSong('/assets/sad_jazz_full.mp3');
  }

  play(section: SongSection) {
    this.playerService.enqueue(section);
  }

  stop() {
    this.playerService.stop();
  }
}
