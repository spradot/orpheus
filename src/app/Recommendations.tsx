'use client';

import { useZustandStore } from '@/util/store';
import { TrackCard } from './TrackCard';

export function Recommendations() {
	const recommendedTracks = useZustandStore(state => state.recommendedTracks);

	return (
		<div className='flex flex-row flex-wrap justify-center gap-x-2 gap-y-2'>
			{recommendedTracks.map(track => {
				return <TrackCard key={track.id} track={track} className='w-96' />;
			})}
		</div>
	);
}
