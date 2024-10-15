'use client';

import { type RawTrackAttributeValue, useZustandStore } from '@/util/store';
import type { GetRecommendationsQuery } from 'spotify-api-types';
import type { ApiRecommendationsResponse } from './api/recommendations/route';

export function SubmitQuery({ className }: { className?: string }) {
	const selectedArtists = useZustandStore(state => state.selectedArtists);
	const selectedTracks = useZustandStore(state => state.selectedTracks);
	const selectedGenres = useZustandStore(state => state.selectedGenres);
	const selectedTrackAttributes = useZustandStore(state => state.selectedTrackAttributes);
	const setRecommendedTracks = useZustandStore(state => state.setRecommendedTracks);

	const isDisabled = selectedArtists.length + selectedGenres.length + selectedTracks.length === 0 ? true : false;

	const buildAndSubmitQuery = async () => {
		const url = `/api/recommendations`;
		let rawAttributes: RawTrackAttributeValue = {};
		for (const [trackAttributeName, trackAttributeValue] of selectedTrackAttributes.entries()) {
			if (!trackAttributeValue.isActive) continue;
			rawAttributes = {
				...rawAttributes,
				[`min_${trackAttributeName}`]: trackAttributeValue.min,
				[`max_${trackAttributeName}`]: trackAttributeValue.max,
				[`target_${trackAttributeName}`]: trackAttributeValue.target,
			};
		}
		const body: GetRecommendationsQuery = {
			seed_artists: selectedArtists.map(artist => artist.id),
			seed_genres: selectedGenres,
			seed_tracks: selectedTracks.map(track => track.id),
			...rawAttributes,
		};
		const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
		const data: ApiRecommendationsResponse = await res.json();
		setRecommendedTracks(data.tracks);
	};

	return (
		<>
			<input
				type='button'
				onClick={buildAndSubmitQuery}
				value='Submit'
				title={isDisabled ? `Select at least one seed Track/Artist/Genre` : ''}
				className={`h-fit w-fit rounded-md px-3 py-1 shadow-md ${isDisabled ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-green-700 text-white hover:bg-green-600'} ${className}`}
				disabled={isDisabled}
			/>
		</>
	);
}
