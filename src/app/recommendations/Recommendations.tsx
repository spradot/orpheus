'use client';

import { useZustandStore } from '@/util/store';
import { type ApiGetRecommendationsResponse } from '../api/recommendations/[id]/route';
import { TrackCard } from '../TrackCard';

export function Recommendations({ id }: { id: string }) {
	const recommendedTracks = useZustandStore(state => state.recommendedTracks);
	const setRecommendedTracks = useZustandStore(state => state.setRecommendedTracks);

	if (!recommendedTracks) {
		return (
			<div className='flex h-screen flex-col items-center justify-center'>
				<h1 className='text-xl text-white'>404 | Page Does Not Exist</h1>
			</div>
		);
	}

	const fetchStoredTracks = async () => {
		const res = await fetch(`/api/recommendations/${id}`);
		const data: ApiGetRecommendationsResponse = await res.json();
		if (data) {
			setRecommendedTracks(data.tracks);
		} else {
			setRecommendedTracks(null);
		}
	};

	if (recommendedTracks.length === 0) {
		fetchStoredTracks();
	}

	return (
		<div className='flex flex-row flex-wrap justify-center gap-x-2 gap-y-2 py-10'>
			{recommendedTracks.map(track => {
				return <TrackCard key={track.id} track={track} />;
			})}
		</div>
	);
}
