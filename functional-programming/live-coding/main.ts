const canvas = document.createElement('canvas');
document.body.append(canvas);
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext('2d')!;

let currentCtx: CanvasRenderingContext2D | undefined;
export function getCtx() {
  if (!currentCtx) throw new Error('Cannot access ctx outside a paint cycle');
  return currentCtx;
}
