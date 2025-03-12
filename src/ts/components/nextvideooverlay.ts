import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { StringUtils } from '../stringutils';
import { AdEvent, LinearAd, PlayerAPI, PlayerEvent } from 'bitmovin-player';

/**
 * Configuration interface for the {@link AdSkipButton}.
 *
 * @category Configs
 */
export interface NextVideoOverlayConfig extends ButtonConfig {
  videoTitle: string;
  callback: () => void;
  secondsRemainingWindow?: number;
}

/**
 * A button that is displayed during ads and can be used to skip the ad.
 *
 * @category Buttons
 */
export class NextVideoOverlay extends Button<NextVideoOverlayConfig> {

  constructor(config: NextVideoOverlayConfig) {
    super(config);

    this.config = this.mergeConfig(config, <NextVideoOverlayConfig>{
      cssClass: 'ui-nextvideooverlay',
      secondsRemainingWindow: 10,
      acceptsTouchWithUiHidden: false,
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.hide();

    let videoTitle = this.config.videoTitle;

    player.on(player.exports.PlayerEvent.TimeChanged, (e) => {
      let secondsRemaining = Math.floor(player.getDuration() - player.getCurrentTime());
      if ( secondsRemaining <= this.config.secondsRemainingWindow) {
        this.setText(`Next up in ${secondsRemaining}: ${videoTitle}`);
        this.show();
      }

      if (secondsRemaining > this.config.secondsRemainingWindow) {
        this.hide();
      }
    });

    player.on(player.exports.PlayerEvent.PlaybackFinished, (e) => {
      this.hide();
      this.config.callback();
    });

    this.onClick.subscribe(() => {
      this.hide();
      this.config.callback();
    });
  }
}