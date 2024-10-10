import { getCtx } from './main';

export type P2 = { x: number; y: number };

const creatureSize = 60;
const creatureRadius = creatureSize / 2;
export function drawCreature(center: P2) {
  const ctx = getCtx();
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'hsl(310, 80%, 50%)';
  ctx.lineWidth = 3;
  ctx.rect(
    center.x - creatureRadius,
    center.y - creatureRadius,
    creatureSize,
    creatureSize
  );
  ctx.fill();
  ctx.stroke();
  return {
    leftAttach: { x: center.x - creatureRadius, y: center.y },
    rightAttach: { x: center.x + creatureRadius, y: center.y },
  };
}

const eyeRadius = 10;
const pupilRadius = 5;
export function drawEye(center: P2, lookingAt: P2 = center) {
  const ctx = getCtx();
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.lineWidth = 2;
  ctx.arc(center.x, center.y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  let pupilCenter: P2;
  const dy = lookingAt.y - center.y;
  const dx = lookingAt.x - center.x;
  const angle = Math.atan2(lookingAt.y - center.y, lookingAt.x - center.x);
  const pupilOffset = Math.min(Math.hypot(dx, dy) / 8, eyeRadius - pupilRadius);
  pupilCenter = {
    x: center.x + Math.cos(angle) * pupilOffset,
    y: center.y + Math.sin(angle) * pupilOffset,
  };
  ctx.fillStyle = 'black';
  ctx.arc(pupilCenter.x, pupilCenter.y, pupilRadius, 0, Math.PI * 2);
  ctx.fill();
}
