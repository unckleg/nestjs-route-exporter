import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { PATH_METADATA } from '@nestjs/common/constants';
import { methodMetadataExplorer } from './method-metadata-explorer';
import { groupBy } from './helper';

export const exploreRoutes = (nestApplication) => {
  const modules: [any] = nestApplication.routesResolver.container.getModules();
  const routes = [];

  modules.forEach(({ controllers }) => {
    controllers.forEach((instanceWrapper) => {
      const { instance } = instanceWrapper;

      const controllerName = instance.constructor.name.replace(
        'Controller',
        '',
      );
      const instancePrototype = Object.getPrototypeOf(instance);
      routes.push(
        groupBy(
          new MetadataScanner().scanFromPrototype(
            instance,
            instancePrototype,
            (method) =>
              methodMetadataExplorer(
                instancePrototype,
                method,
                controllerName,
                Reflect.getMetadata(PATH_METADATA, instanceWrapper.metatype),
              ),
          ),
          'controllerName',
        ),
      );
    });
  });

  return routes;
};
