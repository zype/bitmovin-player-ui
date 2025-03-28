import { ButtonConfig, Button } from '../button';
import { UIInstanceManager } from '../../uimanager';
import { PlayerAPI } from 'bitmovin-player';
import { Component, ComponentConfig } from '../component';
import { Container, ContainerConfig } from '../container';
import { Label, LabelConfig } from '../label';
import { ImageLoader } from '../../imageloader';
import { CssProperties } from '../../dom';

/**
 * Configuration interface for the {@link AdSkipButton}.
 *
 * @category Configs
 */
export interface NextVideoOverlayConfig extends ContainerConfig {
  videoTitle: string;
  videoThumbnail: string;
  callback: () => void;
  secondsRemainingWindow?: number;
}

/**
 * A button that is displayed during ads and can be used to skip the ad.
 *
 * @category Buttons
 */
export class NextVideoOverlay extends Container<NextVideoOverlayConfig> {

  private thumbnail: Component<ComponentConfig>;
  private countdownLabel: Label<LabelConfig>;
  private titleLabel: Label<LabelConfig>;

  private thumbnailImageLoader: ImageLoader;
      
  constructor(config: NextVideoOverlayConfig) {
    super(config);

    this.thumbnail = new Component({ cssClass: 'ui-nextvideo-thumbnail', role: 'img' });
    this.titleLabel = new Label({ cssClass: 'ui-nextvideo-title' });
    this.countdownLabel = new Label({ cssClass: 'ui-nextvideo-countdown' });

    this.thumbnailImageLoader = new ImageLoader();
      
    this.config = this.mergeConfig(config, <NextVideoOverlayConfig>{
      cssClass: 'ui-nextvideooverlay',
      secondsRemainingWindow: 10,
    }, this.config);

    this.addComponent(this.thumbnail);
    this.addComponent(new Container<ContainerConfig>({
      cssClass: 'ui-nextvideo-container',
      components: [
        this.countdownLabel,
        this.titleLabel
      ]
    }));    
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    this.hide();

    let videoTitle = this.config.videoTitle;

    this.setThumbnail(this.config.videoThumbnail);

    player.on(player.exports.PlayerEvent.TimeChanged, (e) => {
      let secondsRemaining = Math.floor(player.getDuration() - player.getCurrentTime());
      if ( secondsRemaining > 0 && secondsRemaining <= this.config.secondsRemainingWindow) {
        this.countdownLabel.setText(`Next up in ${secondsRemaining}`);
        this.titleLabel.setText(videoTitle);
        this.show();
        uimanager.getUI().showUi();
      } else {
        this.hide();
      }
    });
    

    player.on(player.exports.PlayerEvent.PlaybackFinished, (e) => {
      this.config.callback();
    });

    this.countdownLabel.onClick.subscribe(this.config.callback);
    this.titleLabel.onClick.subscribe(this.config.callback);
  }

  /**
   * Sets or removes a thumbnail on the label.
   * @param thumbnail the thumbnail to display on the label or null to remove a displayed thumbnail
   */
  setThumbnail(thumbnail: string) {
    let thumbnailElement = this.thumbnail.getDomElement();

    if (thumbnail == null) {
      thumbnailElement.css({
        'background-image': null,
        'display': null,
        'width': null,
        'height': null,
      });
    }
    else {
      // We use the thumbnail image loader to make sure the thumbnail is loaded and it's size is known before be can
      // calculate the CSS properties and set them on the element.
      this.thumbnailImageLoader.load(thumbnail, (url, width, height) => {
        // can be checked like that because x/y/w/h are either all present or none
        // https://www.w3.org/TR/media-frags/#naming-space
        thumbnailElement.css(this.thumbnailCss(thumbnail, width, height));
      });
    }
  }

  private thumbnailCss(thumbnail: string, width: number, height: number): CssProperties {
    return {
      'background-image': `url(${thumbnail})`
    };
  }
}