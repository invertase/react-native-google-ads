import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withPlugins,
  withInfoPlist,
} from '@expo/config-plugins';

type PluginParameters = {
  androidAppId?: string;
  iosAppId?: string;
  delayAppMeasurementInit?: boolean;
  optimizeInitialization?: boolean;
  optimizeAdLoading?: boolean;
  skAdNetworkItems?: string[];
  userTrackingUsageDescription?: string;
};

const withAndroidAppId: ConfigPlugin<PluginParameters['androidAppId']> = (config, androidAppId) => {
  if (androidAppId === undefined) return config;

  return withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'com.google.android.gms.ads.APPLICATION_ID',
      androidAppId,
    );

    return config;
  });
};

const withAndroidAppMeasurementInitDelayed: ConfigPlugin<
  PluginParameters['delayAppMeasurementInit']
> = (config, delayAppMeasurementInit) => {
  if (delayAppMeasurementInit === undefined) return config;

  return withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'com.google.android.gms.ads.DELAY_APP_MEASUREMENT_INIT',
      delayAppMeasurementInit.toString(),
    );

    return config;
  });
};

const withAndroidInitializationOptimized: ConfigPlugin<
  PluginParameters['optimizeInitialization']
> = (config, optimizeInitialization = true) => {
  return withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'com.google.android.gms.ads.flag.OPTIMIZE_INITIALIZATION',
      optimizeInitialization.toString(),
    );

    return config;
  });
};

const withAndroidAdLoadingOptimized: ConfigPlugin<PluginParameters['optimizeAdLoading']> = (
  config,
  optimizeAdLoading = true,
) => {
  return withAndroidManifest(config, config => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      'com.google.android.gms.ads.flag.OPTIMIZE_AD_LOADING',
      optimizeAdLoading.toString(),
    );

    return config;
  });
};

const withIosAppId: ConfigPlugin<PluginParameters['iosAppId']> = (config, iosAppId) => {
  if (iosAppId === undefined) return config;

  return withInfoPlist(config, config => {
    config.modResults.GADApplicationIdentifier = iosAppId;
    return config;
  });
};

const withIosAppMeasurementInitDelayed: ConfigPlugin<
  PluginParameters['delayAppMeasurementInit']
> = (config, delayAppMeasurementInit = false) => {
  return withInfoPlist(config, config => {
    config.modResults.GADDelayAppMeasurementInit = delayAppMeasurementInit;
    return config;
  });
};

const withIosAkAdNetworkItems: ConfigPlugin<PluginParameters['skAdNetworkItems']> = (
  config,
  skAdNetworkItems,
) => {
  if (skAdNetworkItems === undefined) return config;

  return withInfoPlist(config, config => {
    config.modResults.SKAdNetworkItems = config.modResults.SKAdNetworkItems ?? [];

    const existingIdentifiers = config.modResults.SKAdNetworkItems.map(
      (item: { SKAdNetworkIdentifier: string }) => item.SKAdNetworkIdentifier,
    );

    const missingIdentifiers = skAdNetworkItems.filter(
      skAdNetworkItem => !existingIdentifiers.includes(skAdNetworkItem),
    );

    config.modResults.SKAdNetworkItems.push(
      ...missingIdentifiers.map(identifier => ({
        SKAdNetworkIdentifier: identifier,
      })),
    );

    return config;
  });
};

const withIosUserTrackingUsageDescription: ConfigPlugin<
  PluginParameters['userTrackingUsageDescription']
> = (config, userTrackingUsageDescription) => {
  if (userTrackingUsageDescription === undefined) return config;

  return withInfoPlist(config, config => {
    config.modResults.NSUserTrackingUsageDescription = userTrackingUsageDescription;
    return config;
  });
};

const withReactNativeGoogleMobileAds: ConfigPlugin<PluginParameters> = (
  config,
  {
    androidAppId,
    delayAppMeasurementInit,
    optimizeInitialization,
    optimizeAdLoading,
    iosAppId,
    skAdNetworkItems,
    userTrackingUsageDescription,
  } = {},
) => {
  if (androidAppId === undefined) {
    console.warn(
      "No 'androidAppId' was provided. The native Google Mobile Ads SDK will crash on Android without it.",
    );
  }

  if (iosAppId === undefined) {
    console.warn(
      "No 'iosAppId' was provided. The native Google Mobile Ads SDK will crash on iOS without it.",
    );
  }

  return withPlugins(config, [
    // Android
    [withAndroidAppId, androidAppId],
    [withAndroidAppMeasurementInitDelayed, delayAppMeasurementInit],
    [withAndroidInitializationOptimized, optimizeInitialization],
    [withAndroidAdLoadingOptimized, optimizeAdLoading],
    // iOS
    [withIosAppId, iosAppId],
    [withIosAppMeasurementInitDelayed, delayAppMeasurementInit],
    [withIosAkAdNetworkItems, skAdNetworkItems],
    [withIosUserTrackingUsageDescription, userTrackingUsageDescription],
  ]);
};

export default withReactNativeGoogleMobileAds;
