import { ButtonConfig, Button } from '../button';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../../localization/i18n';

/**
 * @category Configs
 */
export interface CopyLinkButtonConfig extends ButtonConfig {
  url?: string,
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class CopyLinkButton extends Button<CopyLinkButtonConfig> {

  constructor(config: CopyLinkButtonConfig={}) {
    super(config);
    
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-copylinkbutton',
    }, this.config);

    this.config.text = this.config.text || i18n.getLocalizer('linkedinshare')
    this.config.ariaLabel = this.config.text || i18n.getLocalizer('linkedinshare')
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      navigator.clipboard.writeText(this.config.url || '')
      this.getDomElement().addClass('copied')
      setTimeout(() => {
        this.getDomElement().removeClass('copied');
      },1500)
    });
  }
}
