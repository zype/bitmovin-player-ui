import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../localization/i18n';
import { Component, ComponentConfig } from './component';

/**
 * @category Configs
 */
export interface CopyEmbedButtonConfig extends ButtonConfig {
  embedCode?: string,
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class CopyEmbedButton extends Button<CopyEmbedButtonConfig> {

  constructor(config: CopyEmbedButtonConfig={}) {
    super(config);
    
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-copyembedbutton',
    }, this.config);

    this.config.text = this.config.text || i18n.getLocalizer('linkedinshare')
    this.config.ariaLabel = this.config.text || i18n.getLocalizer('linkedinshare')
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      navigator.clipboard.writeText(this.config.embedCode || '')
      this.getDomElement().addClass('copied')
      setTimeout(() => {
        this.getDomElement().removeClass('copied');
      },1500)
    });
  }
}
