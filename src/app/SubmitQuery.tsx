'use client';

import { useZustandStore } from '@/util/store';
import type { ApiRecommendationsResponse } from './api/recommendations/route';

export function SubmitQuery({ className }: { className?: string }) {
	const selectedArtists = useZustandStore(state => state.selectedArtists);
	const selectedTracks = useZustandStore(state => state.selectedTracks);
	const selectedGenres = useZustandStore(state => state.selectedGenres);
	const setRecommendedTracks = useZustandStore(state => state.setRecommendedTracks);

	const buildAndSubmitQuery = async () => {
		const artistsQuery = selectedArtists.map(artist => artist.id).join(',');
		const genresQuery = selectedGenres.join(',');
		const tracksQuery = selectedTracks.map(track => track.id).join(',');
		const url = `/api/recommendations?artists=${artistsQuery}&genres=${genresQuery}&tracks=${tracksQuery}`;
		const res = await fetch(url);
		const data: ApiRecommendationsResponse = await res.json();
		setRecommendedTracks(data.tracks);
	};

	return (
		<>
			<input
				type='button'
				onClick={buildAndSubmitQuery}
				value='Submit'
				className={`h-fit w-fit cursor-pointer rounded-md bg-green-700 px-3 py-1 text-white shadow-md hover:bg-green-600 ${className}`}
			/>
		</>
	);
}
