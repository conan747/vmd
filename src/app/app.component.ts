import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlayerService } from './player.service';
import { SongParticle } from './data/song';
import { inject } from '@angular/core';
import { SongSection } from './data/song';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly playerService: PlayerService = inject(PlayerService);
  protected readonly SongParticle = SongParticle;
  protected readonly SongSection = SongSection;
  // readonly section$ = this.playerService.section$;
  // readonly nextSection$ = this.playerService.nextSection$;
  readonly songState$ = this.playerService.songState$;

  readonly availableSections = [
    SongSection.INTRO,
    SongSection.VERSE,
    SongSection.CHORUS,
    SongSection.BRIDGE,
    SongSection.OUTRO,
  ];

  loadSong() {
    this.playerService.loadSong('/assets/sad_jazz_full.mp3');
  }

  play(section: SongSection, fromIntro = false) {
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
