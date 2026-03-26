import { create } from 'zustand';
import { NormalizedSong } from '../types';

interface PlayerState {
    // Current playback
    currentSong: NormalizedSong | null;
    isPlaying: boolean;
    position: number; // milliseconds
    duration: number; // milliseconds

    // Queue
    queue: NormalizedSong[];
    currentIndex: number;

    // Actions
    playSong: (song: NormalizedSong, index?: number) => void;
    pause: () => void;
    resume: () => void;
    next: () => void;
    previous: () => void;
    addToQueue: (song: NormalizedSong) => void;
    removeFromQueue: (index: number) => void;
    setQueue: (songs: NormalizedSong[], startIndex?: number) => void;
    setPosition: (position: number) => void;
    setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    queue: [],
    currentIndex: -1,

    playSong: (song, index) => {
        const { queue } = get();

        // If explicit index provided, use it directly
        if (index !== undefined && index >= 0 && index < queue.length) {
            set({ currentSong: song, currentIndex: index, isPlaying: true, position: 0, duration: 0 });
            return;
        }

        // Otherwise, look up by id
        const existingIndex = queue.findIndex((s) => s.id === song.id);

        if (existingIndex >= 0) {
            set({ currentSong: song, currentIndex: existingIndex, isPlaying: true, position: 0, duration: 0 });
        } else {
            set((state) => ({
                currentSong: song,
                queue: [...state.queue, song],
                currentIndex: state.queue.length,
                isPlaying: true,
                position: 0,
                duration: 0,
            }));
        }
    },

    pause: () => set({ isPlaying: false }),

    resume: () => {
        const { currentSong } = get();
        if (currentSong) set({ isPlaying: true });
    },

    next: () => {
        const { queue, currentIndex } = get();
        if (currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            set({
                currentSong: queue[nextIndex],
                currentIndex: nextIndex,
                isPlaying: true,
                position: 0,
                duration: 0,
            });
        }
    },

    previous: () => {
        const { queue, currentIndex } = get();
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            set({
                currentSong: queue[prevIndex],
                currentIndex: prevIndex,
                isPlaying: true,
                position: 0,
                duration: 0,
            });
        }
    },

    addToQueue: (song) => {
        set((state) => {
            const exists = state.queue.some((s) => s.id === song.id);
            if (exists) return state;
            return { queue: [...state.queue, song] };
        });
    },

    removeFromQueue: (index) => {
        set((state) => {
            const newQueue = [...state.queue];
            newQueue.splice(index, 1);

            let newIndex = state.currentIndex;
            if (index < state.currentIndex) {
                newIndex = state.currentIndex - 1;
            } else if (index === state.currentIndex) {
                const nextSong = newQueue[newIndex] || newQueue[newIndex - 1] || null;
                newIndex = nextSong ? newQueue.indexOf(nextSong) : -1;
                return {
                    queue: newQueue,
                    currentIndex: newIndex,
                    currentSong: nextSong,
                    isPlaying: nextSong ? state.isPlaying : false,
                };
            }

            return { queue: newQueue, currentIndex: newIndex };
        });
    },

    setQueue: (songs, startIndex = 0) => {
        set({
            queue: songs,
            currentIndex: startIndex,
            currentSong: songs[startIndex] || null,
            isPlaying: true,
            position: 0,
            duration: 0,
        });
    },

    setPosition: (position) => set({ position }),
    setDuration: (duration) => set({ duration }),
}));
