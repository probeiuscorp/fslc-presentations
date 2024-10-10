let currentCtx: CanvasRenderingContext2D | undefined;
export function getCtx() {
  if (!currentCtx) throw new Error('Cannot access ctx outside a paint cycle');
  return currentCtx;
}

const canvas = document.createElement('canvas');
document.body.append(canvas);
const ctx = canvas.getContext('2d')!;
