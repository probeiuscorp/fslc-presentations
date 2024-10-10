import { atom } from 'jotai';

export const dprAtom = atom(devicePixelRatio);
dprAtom.onMount = (setAtom) => {
  let disconnected = false;
  function listenOnDevicePixelRatio() {
    function onChange() {
      if (disconnected) return;
      setAtom(devicePixelRatio);
      listenOnDevicePixelRatio();
    }
    matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener(
      'change',
      onChange,
      { once: true }
    );
  }
  listenOnDevicePixelRatio();
  return () => {
    disconnected = true;
  };
};

export function getSizeAtomFromElement(element: HTMLElement) {
  function getSize() {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  }
  const sizeAtom = atom(getSize());
  sizeAtom.onMount = (setAtom) => {
    const onResize = () => setAtom(getSize());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  };
  return sizeAtom;
}
