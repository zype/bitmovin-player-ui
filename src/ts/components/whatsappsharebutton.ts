import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../localization/i18n';

/**
 * @category Configs
 */
export interface WhatsappShareButtonConfig extends ButtonConfig {
  url?: string
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class WhatsappShareButton extends Button<WhatsappShareButtonConfig> {

  constructor(config: WhatsappShareButtonConfig={}) {
    super(config);
    
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-whatsappsharebutton',
    }, this.config);

    this.config.text = this.config.text || i18n.getLocalizer('whatsappshare')
    this.config.ariaLabel = this.config.text || i18n.getLocalizer('whatsappshare')
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      window.open(`whatsapp://send?text=${this.config.url}`,'_blank');
    });
  }
}
