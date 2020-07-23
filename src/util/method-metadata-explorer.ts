import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import {
  isString,
  isUndefined,
  validatePath,
} from '@nestjs/common/utils/shared.utils';

export const methodMetadataExplorer = (
  instancePrototype,
  methodName,
  controllerName,
  controllerPrefix,
) => {
  const targetCallback = instancePrototype[methodName];
  const routePath = Reflect.getMetadata(PATH_METADATA, targetCallback);
  if (isUndefined(routePath)) {
    return null;
  }

  const requestMethodEnums = {
    0: 'GET',
    1: 'POST',
    2: 'PUT',
    3: 'DELETE',
    4: 'PATCH',
    5: 'ALL',
    6: 'OPTIONS',
    7: 'HEAD',
  };

  const requestMethod = Reflect.getMetadata(METHOD_METADATA, targetCallback);
  const path = isString(routePath)
    ? [validatePath(routePath)]
    : routePath.map((p) => validatePath(p));

  return {
    controllerName,
    method: requestMethodEnums[requestMethod],
    [methodName]: `/${controllerPrefix}${path[0]}`,
    action: methodName,
  };
};
