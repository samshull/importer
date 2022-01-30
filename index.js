import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import globber from 'glob';
import lodash from 'lodash';

const promisedGlob = promisify(globber);

export default async function importer(url, options = {}) {
    const results = {};
    const promises = [];
    const path = fileURLToPath(url);
    const root = dirname(path);
    const caller = basename(path);
    const {
      glob = promisedGlob,
      extensions = ['.mjs', '.cjs', '.js'],
      exclude = [],
      template = (exts) => `**/*{${exts.join(',')}}`,
      collector = (mod) => mod.default
    } = options;
    const pattern = await template(extensions);
    const files = await glob(pattern, { cwd: root });
    for (const file of files) {
      if (file !== caller && !exclude?.includes(file))
          promises.push(add(root, file, results, collector));
    }
    await Promise.all(promises);
    return results;
}

export function locationToPath(location) {
    return location.substring(0, location.lastIndexOf('.')).split('/');
}

export async function add(root, file, results, collector) {
  const props = locationToPath(file);
  const result = await import(resolve(root, file));
  lodash.set(results, props, collector(result));
}
