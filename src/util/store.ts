import type { ArtistObject, GetRecommendationsQuery, TrackObject } from 'spotify-api-types';
import { create } from 'zustand';
import { type RecommendedTrack } from './utils';

interface ArtistStore {
	selectedArtists: Array<ArtistObject>;
	addArtist: (artist: ArtistObject) => void;
	removeArtist: (artistId: string) => void;

	recommendedTracks: Array<RecommendedTrack> | null;
	setRecommendedTracks: (tracks: Array<RecommendedTrack> | null) => void;

	selectedGenres: Array<string>;
	updateSelectedGenres: (genres: Array<string>) => void;

	selectedTracks: Array<TrackObject>;
	addTrack: (track: TrackObject) => void;
	removeTrack: (trackId: string) => void;

	selectedLimit: number;
	setSelectedLimit: (limit: number) => void;

	showDialog: boolean;
	setShowDialog: (showDialog: boolean) => void;

	selectedTrackAttributes: Map<TrackAttributeName, TrackAttributeValue>;
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

	selectedLimit: 20,
	setSelectedLimit: limit => {
		set(() => ({ selectedLimit: limit }));
	},

	showDialog: false,
	setShowDialog: showDialog => {
		set(() => {
			if (showDialog) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
			return { showDialog };
		});
	},

	selectedTrackAttributes: initDefaultAttributeValues(),
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
	defaultMin: number;
	target: number;
	max: number;
	defaultMax: number;
	isActive: boolean;
	step: number;
}

function initDefaultAttributeValues(): Map<TrackAttributeName, TrackAttributeValue> {
	const TRACK_ATTRIBUTES: Array<TrackAttributeName> = [
		'acousticness',
		'danceability',
		'duration_ms',
		'energy',
		'instrumentalness',
		'key',
		'liveness',
		'loudness',
		'mode',
		'popularity',
		'speechiness',
		'tempo',
		'time_signature',
		'valence',
	];
	const defaultAttributeValues = new Map<TrackAttributeName, TrackAttributeValue>();
	for (const trackAttributeName of TRACK_ATTRIBUTES) {
		let min, target, max, step;
		switch (trackAttributeName) {
			case 'duration_ms':
				min = 0;
				max = 3600;
				step = 1;
				target = Math.round((min + max) / 2);
				break;

			case 'key':
				min = 0;
				max = 11;
				step = 1;
				target = Math.round((min + max) / 2);
				break;

			case 'popularity':
				min = 0;
				max = 100;
				step = 1;
				target = Math.round((min + max) / 2);
				break;

			case 'time_signature':
				min = 0;
				max = 11;
				step = 1;
				target = Math.round((min + max) / 2);
				break;

			default:
				min = 0;
				max = 1;
				step = 0.01;
				target = (min + max) / 2;
				break;
		}
		defaultAttributeValues.set(trackAttributeName, {
			min,
			defaultMin: min,
			target,
			max,
			defaultMax: max,
			step,
			isActive: false,
		});
	}
	return defaultAttributeValues;
}
