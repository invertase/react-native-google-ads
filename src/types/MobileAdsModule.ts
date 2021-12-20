import { EventEmitter } from 'react-native';

import { AdapterStatus } from './AdapterStatus';
import { GoogleAdsNativeModule } from './GoogleAdsNativeModule';
import { RequestConfiguration } from './RequestConfiguration';

/**
 * The Google Ads service interface.
 */
export interface MobileAdsModule {
  /**
   * Initialize the SDK.
   */
  initialize(): Promise<AdapterStatus[]>;

  /**
   * Sets request options for all future ad requests.
   *
   * #### Example
   *
   * ```js
   * import googleAds, { MaxAdContentRating } from '@invertase/react-native-google-ads';
   *
   * await googleAds().setRequestConfiguration({
   *   // Update all future requests suitable for parental guidance
   *   maxAdContentRating: MaxAdContentRating.PG,
   * });
   * ```
   *
   * @param requestConfiguration An RequestConfiguration interface used on all future Google Ads ad requests.
   */
  setRequestConfiguration(requestConfiguration: RequestConfiguration): Promise<void>;

  /**
   * The native module instance for the Google Ads service.
   */
  native: GoogleAdsNativeModule;

  /**
   * Returns the shared event emitter instance used for all JS event routing.
   */
  emitter: EventEmitter;
}
