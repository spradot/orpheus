import type { ArtistObject, GetRecommendationsQuery, TrackObject } from 'spotify-api-types';
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

	selectedTrackAttributes: Map<TrackAttributeName, TrackAttributeValue>;
	setSelectedTrackAttributes: (
		trackAttributeName: TrackAttributeName,
		trackAttributeValue: TrackAttributeValue,
	) => void;
	updateSelectedTrackAttributes: (
		trackAttributeName: TrackAttributeName,
		trackAttributeValue: Partial<TrackAttributeValue>,
	) => void;
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

	selectedTrackAttributes: new Map(),
	setSelectedTrackAttributes: (trackAttributeName, trackAttributeValue) => {
		set(state => {
			const newMap = new Map(state.selectedTrackAttributes);
			newMap.set(trackAttributeName, trackAttributeValue);
			return { selectedTrackAttributes: newMap };
		});
	},
	updateSelectedTrackAttributes: (trackAttributeName, trackAttributeValue) => {
		set(state => {
			const newMap = new Map(state.selectedTrackAttributes);
			const currentValue = newMap.get(trackAttributeName)!;
			newMap.set(trackAttributeName, { ...currentValue, ...trackAttributeValue });
			return { selectedTrackAttributes: newMap };
		});
	},
}));

export type RawTrackAttributeName = keyof Omit<
	GetRecommendationsQuery,
	'seed_artists' | 'seed_genres' | 'seed_tracks' | 'limit' | 'market'
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type TrackAttributeName = RawTrackAttributeName extends `${infer BeforeUnderscore}_${infer AfterUnderScore}`
	? AfterUnderScore
	: never;

export type RawTrackAttributeValue = Partial<Record<RawTrackAttributeName, number>>;

export interface TrackAttributeValue {
	min: number;
	target: number;
	max: number;
	isActive: boolean;
}
