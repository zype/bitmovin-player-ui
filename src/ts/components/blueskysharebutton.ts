import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../localization/i18n';

/**
 * @category Configs
 */
export interface BlueskyShareButtonConfig extends ButtonConfig {
  url?: string
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class BlueskyShareButton extends Button<BlueskyShareButtonConfig> {

  constructor(config: BlueskyShareButtonConfig={}) {
    super(config);
    
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-blueskysharebutton',
    }, this.config);

    this.config.text = this.config.text || i18n.getLocalizer('blueskyshare')
    this.config.ariaLabel = this.config.text || i18n.getLocalizer('blueskyshare')
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      window.open(`https://bsky.app/intent/compose?text=${this.config.url}`,'_blank');
    });
  }
}
