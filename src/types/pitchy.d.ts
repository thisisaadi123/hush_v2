declare module 'pitchy' {
  // Minimal ambient types — runtime detection is used, so these signatures
  // are intentionally permissive.
  export function getPitch(buffer: any, sampleRate: number): Promise<[number, number][]>;
  const _default: any;
  export default _default;
}
