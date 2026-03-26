import { Song, NormalizedSong } from '../types';

const JIOSAAVN_BASE = 'https://saavn.sumit.co';
const ITUNES_BASE = 'https://itunes.apple.com';

// Normalize JioSaavn song to internal format
function normalizeJioSaavnSong(song: Song): NormalizedSong {
    const artist =
        song.primaryArtists ||
        song.artists?.primary?.map((a) => a.name).join(', ') ||
        'Unknown Artist';

    const imageUrl =
        song.image?.find((img) => img.quality === '500x500')?.url ||
        song.image?.find((img) => img.quality === '150x150')?.url ||
        '';

    const audioUrl =
        song.downloadUrl?.find((d) => d.quality === '160kbps')?.url ||
        song.downloadUrl?.find((d) => d.quality === '96kbps')?.url ||
        song.downloadUrl?.[0]?.url ||
        '';

    return {
        id: song.id,
        name: song.name,
        artist,
        album: song.album?.name || 'Unknown Album',
        duration: song.duration || 0,
        imageUrl,
        audioUrl,
    };
}

// Normalize iTunes song to internal format
function normalizeITunesSong(item: any): NormalizedSong {
    return {
        id: String(item.trackId),
        name: item.trackName || 'Unknown',
        artist: item.artistName || 'Unknown Artist',
        album: item.collectionName || 'Unknown Album',
        duration: Math.floor((item.trackTimeMillis || 0) / 1000),
        imageUrl: item.artworkUrl100?.replace('100x100', '500x500') || '',
        audioUrl: item.previewUrl || '',
    };
}

// Search songs — tries JioSaavn first, falls back to iTunes
export async function searchSongs(
    query: string,
    page: number = 1,
    limit: number = 20
): Promise<{ songs: NormalizedSong[]; hasMore: boolean }> {
    try {
        return await searchJioSaavn(query, page, limit);
    } catch (error) {
        console.warn('JioSaavn failed, falling back to iTunes:', error);
        return await searchITunes(query, page, limit);
    }
}

async function searchJioSaavn(
    query: string,
    page: number,
    limit: number
): Promise<{ songs: NormalizedSong[]; hasMore: boolean }> {
    const response = await fetch(
        `${JIOSAAVN_BASE}/api/search/songs?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error(`JioSaavn HTTP ${response.status}`);

    const data = await response.json();
    if (!data.success && !data.data) throw new Error('JioSaavn returned invalid data');

    const results = data.data?.results || [];
    const total = data.data?.total || 0;

    return {
        songs: results.map(normalizeJioSaavnSong),
        hasMore: page * limit < total,
    };
}

async function searchITunes(
    query: string,
    page: number,
    limit: number
): Promise<{ songs: NormalizedSong[]; hasMore: boolean }> {
    const offset = (page - 1) * limit;
    const response = await fetch(
        `${ITUNES_BASE}/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}&offset=${offset}`
    );
    if (!response.ok) throw new Error(`iTunes HTTP ${response.status}`);

    const data = await response.json();
    const results = data.results || [];

    return {
        songs: results.map(normalizeITunesSong),
        hasMore: results.length === limit,
    };
}

// Get trending / default songs (for initial load)
export async function getTrendingSongs(
    page: number = 1,
    limit: number = 20
): Promise<{ songs: NormalizedSong[]; hasMore: boolean }> {
    return searchSongs('trending', page, limit);
}
