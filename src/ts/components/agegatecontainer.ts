import {ContainerConfig, Container} from './container';
import {Component, ComponentConfig} from './component';
import {DOM} from '../dom';
import {UIInstanceManager} from '../uimanager';
import { PlayerAPI } from 'bitmovin-player';

/**
 * Overlays the player and displays recommended videos.
 *
 * @category Containers
 */
export class AgeGateContainer extends Container<ContainerConfig> {

  constructor(config: ContainerConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-agegatecontainer',
    }, this.config);
  }

  configure(player: PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);
  }
}
