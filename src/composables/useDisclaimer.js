import { shallowRef } from 'vue';

export const showOverlay = shallowRef(false);
export const neverShowOverlay = shallowRef(false);

export function useDisclaimer() {
  return { showOverlay, neverShowOverlay };
}
