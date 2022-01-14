# import-dir

> Using the `import.meta.url` file URL to recursively and dynamically
> `import()` each of the files inside the directory of the specified URL.
> The `default` export for each file (module) is collected into a
> dictionary that sets the export into a directory delimited structure.

### Directory structure example
```
- directory1
  - index.js (file that calls `importDir(import.meta.url)`
  - file1.js
  - directory2
    - file2.mjs
    - file3.cjs
```

### Returned object structure example
```js
{
  file1: (default export of file1.js),
  directory2: {
    file2: (default export of file2.mjs),
    file3: (default export of file3.cjs),
  }
}
```

## Usage
```js
import importDir from 'import-dir';

export const defaults = await importDir(import.meta.url);
// or
export const defaults = await importDir(import.meta.url, { exclude: ['directory2/file2.mjs'] });
```

# Arguments
The default export function of `import-dir` accepts 2 arguments, the first is a file URL, typically the value of `import.meta.url` from the ESM that invokes the function. The second argument is a dictionary of options outlined here:

- `exclude: string[] = []` An array of string file paths relative to the initial file URL that
  should be excluded from the returned object.
- `glob: (pattern: string, options: GlobOptions) => Promise<string[]> = glob` A function that accepts a glob pattern as the first argument and an object that specifies `{ cwd: dirname(fileUrlToPath(import.meta.url)) }`.
- `extensions: string[] = ['.mjs', '.cjs', '.js']` An array of string file extensions that will
  be used in the [glob](https://www.npmjs.com/package/glob) pattern used for determining the files that should be imported.
- `template: (exts: string[]) => string = (exts) => '**/*{${exts.join(',')}}'` A function that takes a list of file extensions that should be looked for and returns a glob file matching pattern.
- `collector: (mod: Module) => any = (mod) => mod.default` A function that accepts the result of `await import(file)` as an argument and returns the value that should be stored as the value of the file in the object structure.
