// src/types/global.d.ts (or src/declarations.d.ts)
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
