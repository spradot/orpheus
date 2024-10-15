import type { TrackAttributeName } from '@/util/store';
import { TrackAttributeCard } from './TrackAttributeCard';

export function SearchTrackAttribute() {
	return (
		<div className='flex w-96 flex-col gap-y-5 rounded-lg bg-black/40 px-4 pb-4 pt-4 text-white shadow-lg outline-dashed outline-1 outline-gray-400'>
			<div className='flex min-h-8 flex-row items-center gap-x-3'>
				<label htmlFor='' className='rounded-lg px-2 text-lg outline outline-1'>
					Track Attributes
				</label>
			</div>
			<div className='flex flex-col items-center gap-y-2'>
				{TRACK_ATTRIBUTES.map(attributeName => (
					<TrackAttributeCard key={attributeName} trackAttributeName={attributeName} />
				))}
			</div>
		</div>
	);
}

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
