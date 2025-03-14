import { ButtonConfig, Button } from './button';
import { UIInstanceManager } from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { i18n } from '../localization/i18n';

/**
 * @category Configs
 */
export interface RedditShareButtonConfig extends ButtonConfig {
  url?: string
}

/**
 * A button to play/callback a video.
 *
 * @category Buttons
 */
export class RedditShareButton extends Button<RedditShareButtonConfig> {

  constructor(config: RedditShareButtonConfig={}) {
    super(config);
    
    this.config = this.mergeConfig(config, {
      cssClass: 'ui-redditsharebutton',
    }, this.config);

    this.config.text = this.config.text || i18n.getLocalizer('redditshare')
    this.config.ariaLabel = this.config.text || i18n.getLocalizer('redditshare')
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.onClick.subscribe(() => {
      window.open(`https://www.reddit.com/submit?url=${this.config.url}`,'_blank');
    });
  }
}
