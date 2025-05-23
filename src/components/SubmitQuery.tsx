'use client';

import { type ApiPostRecommendationsResponse } from '@/app/api/recommendations/route';
import { type RawTrackAttributeValue, useZustandStore } from '@/util/client/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { GetRecommendationsQuery } from 'spotify-api-types';

export function SubmitQuery({ className }: { className?: string }) {
	const selectedArtists = useZustandStore(state => state.selectedArtists);
	const selectedTracks = useZustandStore(state => state.selectedTracks);
	const selectedGenres = useZustandStore(state => state.selectedGenres);
	const selectedLimit = useZustandStore(state => state.selectedLimit);
	const selectedTrackAttributes = useZustandStore(state => state.selectedTrackAttributes);
	const setRecommendedTracks = useZustandStore(state => state.setRecommendedTracks);
	const router = useRouter();
	const [isFetching, setIsFetching] = useState(false);
	const setDialog = useZustandStore(state => state.setDialog);
	const isMissingRequiredFields =
		selectedArtists.length + selectedGenres.length + selectedTracks.length === 0 ? true : false;

	const buildAndSubmitQuery = async () => {
		setIsFetching(true);
		const url = `/api/recommendations`;
		let rawAttributes: RawTrackAttributeValue = {};
		for (const [trackAttributeName, trackAttributeValue] of selectedTrackAttributes.entries()) {
			if (!trackAttributeValue.isActive) continue;
			rawAttributes = {
				...rawAttributes,
				[`min_${trackAttributeName}`]:
					trackAttributeName === 'duration_ms' ? trackAttributeValue.min * 1000 : trackAttributeValue.min,
				[`max_${trackAttributeName}`]:
					trackAttributeName === 'duration_ms' ? trackAttributeValue.max * 1000 : trackAttributeValue.max,
				[`target_${trackAttributeName}`]:
					trackAttributeName === 'duration_ms' ? trackAttributeValue.target * 1000 : trackAttributeValue.target,
			};
		}
		const body: GetRecommendationsQuery = {
			seed_artists: selectedArtists.map(artist => artist.id),
			seed_genres: selectedGenres,
			seed_tracks: selectedTracks.map(track => track.id),
			limit: selectedLimit,
			...rawAttributes,
		};
		const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
		const data: ApiPostRecommendationsResponse = await res.json();
		if (!data) {
			setRecommendedTracks(null);
			setDialog({ isActive: true, description: 'Found Nothing to Recommend' });
			setIsFetching(false);
		} else {
			setRecommendedTracks(data.recTracks);
			router.push(`/rec/${data.id}`, { scroll: true });
			setIsFetching(false);
		}
	};

	return (
		<input
			type='button'
			onClick={buildAndSubmitQuery}
			value={isFetching ? 'Fetching' : 'Submit'}
			title={isMissingRequiredFields ? `Select at least one seed Track/Artist/Genre` : ''}
			className={`h-fit w-fit rounded-md px-3 py-1 shadow-md ${isMissingRequiredFields || isFetching ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-[#1ED760] text-[#121212] hover:bg-green-600'} ${className}`}
			disabled={isMissingRequiredFields || isFetching}
		/>
	);
}
