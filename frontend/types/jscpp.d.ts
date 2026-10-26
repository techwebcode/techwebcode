declare module "JSCPP" {
  const JSCPP: any;
  export default JSCPP;
  export function run(code: string, input?: string, config?: any): number;
}
