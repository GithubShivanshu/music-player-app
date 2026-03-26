import { Audio, AVPlaybackStatus } from 'expo-av';
import { usePlayerStore } from '../store/playerStore';

let sound: Audio.Sound | null = null;

// Configure audio mode for background playback
async function configureAudio() {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
        });
    } catch (e) {
        console.warn('Failed to configure audio mode:', e);
    }
}

// Initialize audio config once
configureAudio();

function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) return;

    const store = usePlayerStore.getState();
    store.setPosition(status.positionMillis);
    store.setDuration(status.durationMillis || 0);

    // Auto-play next when song finishes
    if (status.didJustFinish) {
        store.next();
    }
}

export async function loadAndPlay(uri: string) {
    try {
        // Unload previous sound
        if (sound) {
            await sound.unloadAsync();
            sound = null;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true },
            onPlaybackStatusUpdate
        );
        sound = newSound;
    } catch (e) {
        console.error('Failed to load audio:', e);
    }
}

export async function pauseAudio() {
    try {
        if (!sound) return;

        const status = await sound.getStatusAsync();
        if (!status.isLoaded) return;

        await sound.pauseAsync();
    } catch (e) {
        console.error('Failed to pause:', e);
    }
}

// export async function resumeAudio() {
//     try {
//         if (sound) await sound.playAsync();
//     } catch (e) {
//         console.error('Failed to resume:', e);
//     }
// }
export async function resumeAudio() {
    try {
        if (!sound) return;

        const status = await sound.getStatusAsync();

        if (!status.isLoaded) return;

        await sound.playAsync();
    } catch (e) {
        console.error('Failed to resume:', e);
    }
}

export async function seekTo(positionMillis: number) {
    try {
        if (!sound) return;

        const status = await sound.getStatusAsync();
        if (!status.isLoaded) return;

        await sound.setPositionAsync(positionMillis);
    } catch (e) {
        console.error('Failed to seek:', e);
    }
}

export async function unloadAudio() {
    try {
        if (sound) {
            await sound.unloadAsync();
            sound = null;
        }
    } catch (e) {
        console.error('Failed to unload:', e);
    }
}
