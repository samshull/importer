
export interface ImporterOptions<T = any> {
  glob?: (pattern: string) => Promise<string[]> | string[];
  extensions?: string[];
  exclude?: string[];
  template?: (exts: string[]) => string;
  collector?: (mod: Record<string, any> & { default: any }) => T;
}

declare function importer<F = any, T = Record<string, F>>(url: string | URL, options?: ImporterOptions<F>): Promise<T>;

export default importer;
