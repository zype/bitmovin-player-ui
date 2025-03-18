import { ButtonConfig, Button } from '../button';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../../localization/i18n';

/**
 * @category Configs
 */
export interface XShareButtonConfig extends ButtonConfig {
  url?: string
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class XShareButton extends Button<XShareButtonConfig> {

  constructor(config: XShareButtonConfig={}) {
    super(config);
    
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-xsharebutton',
    }, this.config);

    this.config.text = this.config.text || i18n.getLocalizer('xshare')
    this.config.ariaLabel = this.config.text || i18n.getLocalizer('xshare')
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      window.open(`https://x.com/intent/post?url=${this.config.url}`,'_blank');
    });
  }
}
