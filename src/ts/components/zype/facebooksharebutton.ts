import { ButtonConfig, Button } from '../button';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../../localization/i18n';

/**
 * @category Configs
 */
export interface FacebookShareButtonConfig extends ButtonConfig {
  url?: string
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class FacebookShareButton extends Button<FacebookShareButtonConfig> {

  constructor(config: FacebookShareButtonConfig={}) {
    super(config);
    
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-facebooksharebutton',
    }, this.config);

    this.config.text = this.config.text || i18n.getLocalizer('facebookshare')
    this.config.ariaLabel = this.config.text || i18n.getLocalizer('facebookshare')
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.config.url}`,'_blank');
    });
  }
}
