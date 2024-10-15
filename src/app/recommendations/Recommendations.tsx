'use client';

import { useZustandStore } from '@/util/store';
import { TrackCard } from '../TrackCard';

export function Recommendations() {
	const recommendedTracks = useZustandStore(state => state.recommendedTracks);

	if (recommendedTracks.length === 0) {
		return (
			<div className='flex h-screen flex-col items-center justify-center'>
				<h1 className='text-xl text-white'>Found Nothing To Recommend</h1>
			</div>
		);
	}

	return (
		<div className='flex flex-row flex-wrap justify-center gap-x-2 gap-y-2 py-10'>
			{recommendedTracks.map(track => {
				return <TrackCard key={track.id} track={track} className='w-96' />;
			})}
		</div>
	);
}
