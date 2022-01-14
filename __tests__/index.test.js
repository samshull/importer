import { promisify } from 'node:util';
import { test, expect } from '@jest/globals';
import globber from 'glob';

import importer from '../index';

const glob = promisify(globber);

test('import the files in this directory and below', async function () {
  const results = await importer(import.meta.url);
  expect(results).toMatchObject({
    files: {
      file1: expect.any(Function),
      file2: expect.any(Function),
      file3: expect.any(Function)
    }
  });
});

test('exclude files', async function () {
  const results = await importer(import.meta.url, { exclude: ['files/file2.mjs'] });
  expect(results).toMatchObject({
    files: {
      file1: expect.any(Function),
      file3: expect.any(Function)
    }
  });
  expect(results.files.file2).toBeUndefined();
  expect(results.files.hasOwnProperty('file2')).toBeFalsy();
});

test('import module exports other than default', async function () {
  const results = await importer(import.meta.url, { collector: mod => mod.other });
  expect(results).toMatchObject({
    files: {
      file1: undefined,
      file2: expect.any(Function),
      file3: expect.any(Function)
    }
  });
  expect(results.files.hasOwnProperty('file1')).toBeTruthy();
});

test('skip .mjs files', async function () {
  const results = await importer(import.meta.url, { extensions: ['.cjs', '.js'] });
  expect(results).toMatchObject({
    files: {
      file1: expect.any(Function),
      file3: expect.any(Function)
    }
  });
  expect(results.files.file2).toBeUndefined();
  expect(results.files.hasOwnProperty('file2')).toBeFalsy();
});

test('define the glob pattern', async function () {
  const results = await importer(import.meta.url, {
    template(exts) {
      return `**/file{1,3}{${exts.join(',')}}`;
    }
  });
  expect(results).toMatchObject({
    files: {
      file1: expect.any(Function),
      file3: expect.any(Function)
    }
  });
  expect(results.files.file2).toBeUndefined();
  expect(results.files.hasOwnProperty('file2')).toBeFalsy();
});

test('define your own glob function', async function () {
  const results = await importer(import.meta.url, {
    async glob(pattern, options) {
      return await glob(pattern, { ...options, ignore: '**/file2.mjs' });
    }
  });
  expect(results).toMatchObject({
    files: {
      file1: expect.any(Function),
      file3: expect.any(Function)
    }
  });
  expect(results.files.hasOwnProperty('file2')).toBeFalsy();
});
