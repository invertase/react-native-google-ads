/*
 * Copyright (c) 2016-present Invertase Limited & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { isFunction, isString } from '../common';
import { MobileAds } from '../MobileAds';
import { validateAdRequestOptions } from '../validateAdRequestOptions';
import { validateAdShowOptions } from '../validateAdShowOptions';
import { MobileAd } from './MobileAd';
import { AdEventListener } from '../types/AdEventListener';
import { AdShowOptions } from '../types/AdShowOptions';
import { RequestOptions } from '../types/RequestOptions';
import { MobileAdInterface } from '../types/MobileAd.interface';

let _interstitialRequest = 0;

/**
 * A class for interacting and showing Interstitial Ads.
 *
 * An Interstitial advert can be pre-loaded and shown at a suitable point in your apps flow, such as at the end of a level
 * in a game. An Interstitial is a full screen advert, laid on-top of your entire application which the user can interact with.
 * Interactions are passed back via events which should be handled accordingly inside of your app.
 *
 * #### Example
 *
 * First create a new Interstitial instance, passing in your Ad Unit ID from the Google Ads configuration console, and any additional
 * request options. The example below will present a test advert, and only request a non-personalized ad.
 *
 * ```js
 * import { InterstitialAd, TestIds } from '@invertase/react-native-google-ads';
 *
 * const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
 *     requestNonPersonalizedAdsOnly: true,
 * });
 *  ```
 *
 * Each advert needs to be loaded from Google Ads before being shown. It is recommended this is performed before the user
 * reaches the checkpoint to show the advert, so it's ready to go. Before loading the advert, we need to setup
 * event listeners to listen for updates from Google Mobile Ads, such as advert loaded or failed to load.
 *
 * Event types match the `AdEventType` interface. Once the advert has loaded, we can trigger it to show:
 *
 * ```js
 * import { AdEventType } from '@invertase/react-native-google-ads';
 *
 * interstitial.onAdEvent((type) => {
 *   if (type === AdEventType.LOADED) {
 *     interstitial.show();
 *   }
 * });
 *
 * interstitial.load();
 *  ```
 *
 * The advert will be presented to the user, and several more events can be triggered such as the user clicking the
 * advert or closing it.
 */
export class InterstitialAd extends MobileAd implements MobileAdInterface {
  /**
   * Creates a new InterstitialAd instance.
   *
   * #### Example
   *
   * ```js
   * import { InterstitialAd, AdEventType, TestIds } from '@invertase/react-native-google-ads';
   *
   * const interstitialAd = await InterstitialAd.request(TestIds.INTERSTITIAL, {
   *   requestAgent: 'CoolAds',
   * });
   *
   * interstitialAd.onAdEvent((type, error) => {
   *   console.log('New event: ', type, error);
   *
   *   if (type === AdEventType.LOADED) {
   *     interstitialAd.show();
   *   }
   * });
   *
   * interstitialAd.load();
   * ```
   *
   * @param adUnitId The Ad Unit ID for the Interstitial. You can find this on your Google Mobile Ads dashboard.
   * @param requestOptions Optional RequestOptions used to load the ad.
   */
  static createForAdRequest(adUnitId: string, requestOptions?: RequestOptions): InterstitialAd {
    if (!isString(adUnitId)) {
      throw new Error("InterstitialAd.createForAdRequest(*) 'adUnitId' expected an string value.");
    }

    let options = {};
    try {
      options = validateAdRequestOptions(requestOptions);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`InterstitialAd.createForAdRequest(_, *) ${e.message}.`);
      }
    }

    const requestId = _interstitialRequest++;
    return new InterstitialAd('interstitial', MobileAds(), requestId, adUnitId, options);
  }

  load() {
    // Prevent multiple load calls
    if (this._loaded || this._isLoadCalled) {
      return;
    }

    this._isLoadCalled = true;
    this._googleAds.native.interstitialLoad(this._requestId, this._adUnitId, this._requestOptions);
  }

  onAdEvent(handler: AdEventListener) {
    if (!isFunction(handler)) {
      throw new Error("InterstitialAd.onAdEvent(*) 'handler' expected a function.");
    }

    return this._setAdEventHandler(handler);
  }

  show(showOptions?: AdShowOptions) {
    if (!this._loaded) {
      throw new Error(
        'InterstitialAd.show() The requested InterstitialAd has not loaded and could not be shown.',
      );
    }

    let options;
    try {
      options = validateAdShowOptions(showOptions);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`InterstitialAd.show(*) ${e.message}.`);
      }
    }

    return this._googleAds.native.interstitialShow(this._requestId, options);
  }
}
