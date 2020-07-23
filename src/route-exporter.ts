import 'reflect-metadata';
import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { exploreRoutes } from './util/route-explorer';
import { directoryCreator } from './util/directory-creator';
import { stubJavascript, stubTypescript } from './stub';

/**
 *
 * @param  {INestApplication} nestApplication
 * @param  {String} baseUri  | 'https://api.djordjes.com/'
 * @param  {String} path     | './routes' || './routes/api' || './routes/api/nested'
 * @param  {String} fileName | 'api.ts' || 'api.js'
 * @return String
 */
export const routeExporter = (
  nestApplication: INestApplication,
  baseUri: string,
  path: string,
  fileName: string,
): string => {
  // Create directories first and chmod them
  directoryCreator(path);

  // For checking if we should use js or ts stubs.
  const isTypescript = fileName.includes('.ts');

  // Explore nestApplication routes.
  const routes = exploreRoutes(nestApplication);

  // Iterate over all routes and prepare route list string that will be written in the specified file.
  let content = '';
  let capturedEndpoints = {};
  routes.forEach(item => {
    const resource = Object.keys(item)[0];
    const endpoints = item[resource];
    content += (isTypescript ? stubTypescript : stubJavascript).replace('{{Resource}}', resource);
    let actionPath = '';
    let indent = null;
    let i = 0;
    let capturedEndpointTypehint = '';
    endpoints.map(endpoint => {
      i = i + 1;

      actionPath += (indent ? '  ' : '') + `${endpoint.action}: `
        + '{ path: ' + `'` + baseUri + endpoint[endpoint.action] + '\', ' + `method: '${endpoint.method}' },\n`;
      indent = true;
      if (!capturedEndpoints.hasOwnProperty(resource)) {
        capturedEndpoints[resource] = [];
      }

      if (isTypescript) {
        if (endpoints.length > 1 && i === 1) {
          capturedEndpointTypehint = ` \n  { \n    ${endpoint.action}: { path: string, method: string }, \n `;
        } else if (endpoints.length === 1) {
          capturedEndpointTypehint = ` { ${endpoint.action}: { path: string, method: string } } `;
        } else if (endpoint.length !== i && i !== 1) {
          capturedEndpointTypehint += `   ${endpoint.action}: { path: string, method: string }, \n `;
        } else if (endpoint.length === i) {
          capturedEndpointTypehint += '} =';
        }

        if (endpoints.length === i && endpoints.length > 1) {
          capturedEndpoints[resource].push(
            capturedEndpointTypehint.substring(0, capturedEndpointTypehint.length - 5) + '  } \n } = \n'
          );
        } else if (endpoints.length === 1) {
          capturedEndpoints[resource].push(capturedEndpointTypehint + '=');
        }
      }
    });

    content = content
      .replace('{{ActionPaths}}', actionPath)
      .replace(/^\s*\n/gm, '')
      .replace(/^\s+|\s+$/g, '');
  });

  // Normalize line breaks
  const result = (content.replace(/;/g, ';\n'));
  let normalizedResult = result;
  if (isTypescript) {
    for (const definition of Object.values(capturedEndpoints)) {
      normalizedResult = normalizedResult.replace(' any =', `${definition}`);
    }
  }

  // Final step write routes to file.
  fs.writeFile(`${path}/${fileName}`, normalizedResult, err => {
    if (err) {
      throw err;
    }

    fs.chmod(`${path}/${fileName}`, '0777', () => undefined);
  });

  return normalizedResult;
};
