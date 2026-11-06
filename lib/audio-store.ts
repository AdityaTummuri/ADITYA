import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAudioEnabled, unlockAudio } from './audio-engine';

interface AudioState {
  enabled: boolean;
  everEnabled: boolean; // true once user has clicked the button once
  toggle: () => void;
  enable: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      enabled: false,
      everEnabled: false,
      toggle: () => {
        const next = !get().enabled;
        // First interaction always unlocks the context
        unlockAudio();
        setAudioEnabled(next);
        set({ enabled: next, everEnabled: true });
      },
      enable: () => {
        unlockAudio();
        setAudioEnabled(true);
        set({ enabled: true, everEnabled: true });
      },
    }),
    {
      name: 'audio-pref',
      onRehydrateStorage: () => (state) => {
        // Restore enabled state to audio engine after hydration.
        // Audio won't actually start until unlockAudio() is called on gesture.
        if (state?.enabled) {
          setAudioEnabled(true);
        }
      },
    }
  )
);

