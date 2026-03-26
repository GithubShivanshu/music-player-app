export interface Song {
  id: string;
  name: string;
  duration: number;
  language: string;
  year: string;
  album: {
    id: string;
    name: string;
    url?: string;
  };
  artists: {
    primary: Array<{
      id: string;
      name: string;
      role: string;
    }>;
  };
  image: Array<{
    quality: string;
    url: string;
  }>;
  downloadUrl: Array<{
    quality: string;
    url: string;
  }>;
  primaryArtists?: string;
  playCount?: number;
}

// Normalized song for internal use
export interface NormalizedSong {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
  audioUrl: string;
}

export type RootStackParamList = {
  Home: undefined;
  Player: undefined;
};
