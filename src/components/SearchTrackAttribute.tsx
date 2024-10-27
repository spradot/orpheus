import { type TrackAttributeName } from '@/util/client/store';
import { TrackAttributeCard } from './TrackAttributeCard';

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

export function SearchTrackAttribute() {
	return (
		<div className='flex w-96 min-w-96 flex-col gap-y-5 rounded-lg bg-black/30 px-4 pb-4 pt-4 text-white shadow-lg outline-dashed outline-1 outline-gray-400'>
			<h1 className='w-fit rounded-lg px-2 text-lg outline outline-1'>Track Attributes</h1>
			<div className='flex flex-col items-center gap-y-2'>
				{TRACK_ATTRIBUTES.map(attributeName => (
					<TrackAttributeCard key={attributeName} trackAttributeName={attributeName} />
				))}
			</div>
		</div>
	);
}
