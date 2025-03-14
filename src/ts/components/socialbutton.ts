import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../localization/i18n';
import { SocialOverlay } from './socialoverlay';

/**
 * @category Configs
 */
export interface SocialButtonConfig extends ButtonConfig {
  socialOverlay?: SocialOverlay;
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class SocialButton extends Button<SocialButtonConfig> {

  constructor(config: SocialButtonConfig) {
    super(config);

    this.config = this.mergeConfig(config, <SocialButtonConfig>{
      cssClass: 'ui-socialbutton',
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      console.log(this.config.socialOverlay)
      if(this.config.socialOverlay != null) {
        this.config.socialOverlay.show();
      }
    });
  }
}
