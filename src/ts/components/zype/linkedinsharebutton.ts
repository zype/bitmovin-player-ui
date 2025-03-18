import { ButtonConfig, Button } from '../button';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../../localization/i18n';

/**
 * @category Configs
 */
export interface LinkedinShareButtonConfig extends ButtonConfig {
  url?: string
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class LinkedinShareButton extends Button<LinkedinShareButtonConfig> {

  constructor(config: LinkedinShareButtonConfig={}) {
    super(config);
    
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-linkedinsharebutton',
    }, this.config);

    this.config.text = this.config.text || i18n.getLocalizer('linkedinshare')
    this.config.ariaLabel = this.config.text || i18n.getLocalizer('linkedinshare')
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${this.config.url}`,'_blank');
    });
  }
}
