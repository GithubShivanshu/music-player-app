import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { loadAndPlay, pauseAudio, resumeAudio, unloadAudio } from '../services/audioService';

/**
 * Hook that syncs the Zustand store with the audio service.
 * Place this once in App.tsx so audio reacts to store changes globally.
 */
export function useAudioManager() {
    const currentSong = usePlayerStore((s) => s.currentSong);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const lastSongIdRef = useRef<string | null>(null);

    // Load new song when currentSong changes
    useEffect(() => {
        if (!currentSong || !currentSong.audioUrl) {
            lastSongIdRef.current = null;
            return;
        }

        if (currentSong.id !== lastSongIdRef.current) {
            lastSongIdRef.current = currentSong.id;
            loadAndPlay(currentSong.audioUrl);
        }
    }, [currentSong]);

    // Handle play/pause toggling (without reloading)
    useEffect(() => {
        if (!currentSong) return;
        // Only handle pause/resume when it's the same song (not a new load)
        if (currentSong.id === lastSongIdRef.current) {
            if (isPlaying) {
                // loadAndPlay already starts playing, so only call resume
                // if we explicitly paused before
                resumeAudio();
            } else {
                pauseAudio();
            }
        }
    }, [isPlaying]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            unloadAudio();
        };
    }, []);
}
