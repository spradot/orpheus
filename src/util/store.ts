import { ArtistObject, TrackObject } from 'spotify-api-types';
import { create } from 'zustand';

interface ArtistStore {
	selectedArtists: Array<ArtistObject>;
	addArtist: (artist: ArtistObject) => void;
	removeArtist: (artistId: string) => void;

	recommendedTracks: Array<TrackObject>;
	setRecommendedTracks: (tracks: Array<TrackObject>) => void;

	selectedGenres: Array<string>;
	updateSelectedGenres: (genres: Array<string>) => void;

	selectedTracks: Array<TrackObject>;
	addTrack: (track: TrackObject) => void;
	removeTrack: (trackId: string) => void;
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

	selectedTracks: [],
	addTrack: track => {
		set(state => ({ selectedTracks: [...state.selectedTracks, track] }));
	},
	removeTrack: trackId => {
		set(state => ({ selectedTracks: state.selectedTracks.filter(track => track.id !== trackId) }));
	},
}));
