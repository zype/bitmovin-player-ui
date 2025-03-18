import {ContainerConfig, Container} from './../container';
import {UIInstanceManager} from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { FacebookShareButton } from './facebooksharebutton';
import { XShareButton } from './xsharebutton';
import { RedditShareButton } from './redditsharebutton';
import { BlueskyShareButton } from './blueskysharebutton';
import { WhatsappShareButton } from './whatsappsharebutton';
import { LinkedinShareButton } from './linkedinsharebutton';
import { CopyLinkButton } from './copylinkbutton'
import { CopyEmbedButton } from './copyembedbutton'
import { CloseButton } from '../closebutton';
import { Label, LabelConfig } from '../label';
import { Component, ComponentConfig } from '../component';

/**
 * @category Configs
 */
export interface SocialOverlayConfig extends ContainerConfig {
    url?: string,
    embedCode?: string
  }

/**
 * Overlays the player and displays recommended videos.
 *
 * @category Containers
 */
export class SocialOverlay extends Container<SocialOverlayConfig> {

  private facebookShareButton: FacebookShareButton;
  private xShareButton: XShareButton;
  private redditShareButton: RedditShareButton;
  private blueskyShareButton: BlueskyShareButton;
  private whatsappShareButton: WhatsappShareButton;
  private linkedinShareButton: LinkedinShareButton;
  private copyLinkButton: CopyLinkButton;
  private copyEmbedButton: CopyEmbedButton;

  private copiedLabel: Label<LabelConfig>;

  private closeButton: CloseButton;
  
  constructor(config: SocialOverlayConfig = {}) {
    super(config);

    let socialComponents: Component<ComponentConfig>[] = [];
        
    if(config.url != null){   
        this.facebookShareButton = new FacebookShareButton({url: config.url});
        this.xShareButton = new XShareButton({url: config.url});
        this.redditShareButton = new RedditShareButton({url: config.url});
        this.blueskyShareButton = new BlueskyShareButton({url: config.url})
        this.whatsappShareButton = new WhatsappShareButton({url: config.url})
        this.linkedinShareButton = new LinkedinShareButton({url: config.url})

        this.copyLinkButton = new CopyLinkButton({url: config.url})
        
        socialComponents.push(
            this.facebookShareButton,
            this.whatsappShareButton,
            this.xShareButton,
            this.blueskyShareButton,
            this.redditShareButton,
            this.linkedinShareButton,
            this.copyLinkButton,
        )
    }

    if(config.embedCode != null){
        this.copyEmbedButton = new CopyEmbedButton({embedCode: config.embedCode})
        socialComponents.push(
            this.copyEmbedButton,
        )
    }

    this.closeButton = new CloseButton({cssClass: 'ui-socialclosebutton', target: this});
    this.copiedLabel = new Label(<LabelConfig>{text: '&nbsp;'}); 

    socialComponents.push(this.closeButton)

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-recommendation-overlay',
      hidden: true,
      components: [
        new Container<ContainerConfig>({
          components: socialComponents
        }),
        new Container<ContainerConfig>({
          components: [
            this.copiedLabel
          ]
        })
      ]
    }, this.config);

    this.hide();
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    // Display recommendations when playback has finished
    player.on(player.exports.PlayerEvent.PlaybackFinished, () => {
      this.hide();
    });

    let timeout: NodeJS.Timeout;

    if(this.copyLinkButton != null){
      this.copyLinkButton.onClick.subscribe(() => {
        this.copiedLabel.setText('Copied link to clipboard!');
        if(timeout != null){ clearTimeout(timeout) };
        timeout = setTimeout(() => {
          this.copiedLabel.setText('&nbsp;');
        },1500)
      })
    }

    if(this.copyEmbedButton != null){
      this.copyEmbedButton.onClick.subscribe(() => {
        this.copiedLabel.setText('Copied embed to clipboard!');
        if(timeout != null){ clearTimeout(timeout) };
        timeout = setTimeout(() => {
          this.copiedLabel.setText('&nbsp;');
        },1500)
      })
    }
  }
}

