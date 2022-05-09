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

import { Platform } from 'react-native';
import * as Base64 from './Base64';
import { isString, isNull, isUndefined } from './validate';

export * from './id';
export * from './path';
export * from './promise';
export * from './validate';

export { Base64 };
export { ReferenceBase } from './ReferenceBase';

export function getDataUrlParts(dataUrlString: string) {
  const isBase64 = dataUrlString.includes(';base64');
  let [mediaType, base64String] = dataUrlString.split(',');
  if (!mediaType || !base64String) {
    return { base64String: undefined, mediaType: undefined };
  }
  mediaType = mediaType.replace('data:', '').replace(';base64', '');
  if (base64String && base64String.includes('%')) {
    base64String = decodeURIComponent(base64String);
  }
  if (!isBase64) {
    base64String = Base64.btoa(base64String);
  }
  return { base64String, mediaType };
}

export function once<T>(fn: () => void, context: unknown): (this: T, ...args: []) => void {
  let onceResult: unknown;
  let ranOnce = false;

  return function onceInner(...args: []) {
    if (!ranOnce) {
      ranOnce = true;
      onceResult = fn.apply(context || this, args);
    }

    return onceResult;
  };
}

export function isError(value: unknown) {
  if (Object.prototype.toString.call(value) === '[object Error]') {
    return true;
  }

  return value instanceof Error;
}

export function hasOwnProperty(target: unknown, property: PropertyKey) {
  return Object.hasOwnProperty.call(target, property);
}

export function isPropertySet(target: unknown, property: PropertyKey) {
  return (
    hasOwnProperty(target, property) &&
    !isUndefined((target as Record<PropertyKey, unknown>)[property]) &&
    !isNull((target as Record<PropertyKey, unknown>)[property])
  );
}

/**
 * Remove a trailing forward slash from a string if it exists
 *
 * @param string
 * @returns {*}
 */
export function stripTrailingSlash(string: string) {
  if (!isString(string)) {
    return string;
  }
  return string.endsWith('/') ? string.slice(0, -1) : string;
}

export const isIOS = Platform.OS === 'ios';

export const isAndroid = Platform.OS === 'android';

export function tryJSONParse(string: string) {
  try {
    return string && JSON.parse(string);
  } catch (jsonError) {
    return string;
  }
}

export function tryJSONStringify(data: unknown) {
  try {
    return JSON.stringify(data);
  } catch (jsonError) {
    return null;
  }
}
