import { type Artist } from '@/app/api/artists/route';
import { type Track } from '@/app/api/recommendations/route';
import { create } from 'zustand';

interface ArtistStore {
	selectedArtists: Array<Artist>;
	addArtist: (artist: Artist) => void;
	removeArtist: (artistId: string) => void;

	recommendedTracks: Array<Track>;
	setRecommendedTracks: (tracks: Array<Track>) => void;

	selectedGenres: Array<string>;
	updateSelectedGenres: (genres: Array<string>) => void;
}

export const useZustandStore = create<ArtistStore>(set => ({
	selectedArtists: [],
	addArtist: artist => {
		set(state => ({ selectedArtists: [...state.selectedArtists, artist] }));
	},
	removeArtist: artistId => {
		set(state => ({ selectedArtists: state.selectedArtists.filter(artist => artist.id !== artistId) }));
	},

	recommendedTracks: [],
	setRecommendedTracks: tracks => {
		set(() => ({ recommendedTracks: tracks }));
	},

	selectedGenres: [],
	updateSelectedGenres: genres => {
		set(() => ({ selectedGenres: genres }));
	},
}));
