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
  videoThumbnail: string;
  callback: () => void;
}

export interface SocialConfig {
  embedCode?: string,
  url?: string,
}

/**
 * @category Configs
 */
export interface ZypeUIConfig extends UIConfig {
 continueWatching?: ContinueWatchingConfig;
 social?: SocialConfig;
 ageRequired?: number;
}

