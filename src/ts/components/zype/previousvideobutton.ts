import { ButtonConfig, Button } from '../button';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../../localization/i18n';

/**
 * @category Configs
 */
export interface PreviousVideoButtonConfig extends ButtonConfig {
  videoTitle: string;
  callback: () => void;
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class PreviousVideoButton extends Button<PreviousVideoButtonConfig> {

  constructor(config: PreviousVideoButtonConfig) {
    super(config);

    let videoTitle = this.config.videoTitle;
    
    this.config = this.mergeConfig(config, <PreviousVideoButtonConfig>{
      cssClass: 'ui-previousvideobutton',
    }, this.config);

    this.config.text = this.config.text || `${i18n.getLocalizer('previous')()}: ${videoTitle}`;
    this.config.ariaLabel = this.config.text || `${i18n.getLocalizer('previous')()}: ${videoTitle}`;
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      if(this.config.callback != null) {
        this.config.callback();
      } else {
        console.log('no callback defined')
      }
    });
  }
}
