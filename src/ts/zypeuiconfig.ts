import { UIConfig } from './uiconfig';

/**
 * @category Configs
 */
export interface ContinueWatchingConfig {
  nextVideo?: ContinueWatchingItemConfig;
  previousVideo?: ContinueWatchingItemConfig;
}

export interface ContinueWatchingItemConfig {
  videoTitle: string;
  callback: () => void;
}

/**
 * @category Configs
 */
export interface ZypeUIConfig extends UIConfig {
 continueWatching?: ContinueWatchingConfig;
}
