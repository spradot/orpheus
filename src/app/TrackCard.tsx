import { FaSpotify } from 'react-icons/fa';
import { MdExplicit } from 'react-icons/md';
import type { TrackObject } from 'spotify-api-types';
import { BlurImage } from './BlurImage';

export function TrackCard({ track }: { track: TrackObject }) {
	const trackCover = track.album.images[0];

	return (
		<div className={`flex w-96 flex-row gap-x-1 rounded-2xl bg-black px-3 py-4 shadow-md`}>
			<div className='flex w-full flex-row gap-x-3 overflow-hidden'>
				<BlurImage
					src={trackCover.url}
					height={trackCover.height!}
					width={trackCover.width!}
					alt={track.name}
					className='h-32 w-32 rounded-lg'
				/>
				<div className='flex w-full flex-col gap-y-1 overflow-hidden'>
					<h1 className='flex flex-row items-center gap-x-1 overflow-hidden text-white'>
						{track.explicit && <MdExplicit className='h-6 min-h-6 w-5 min-w-5' />}
						<a
							href={track.external_urls.spotify}
							target='_blank'
							rel='noopener noreferrer'
							className='overflow-hidden text-ellipsis whitespace-nowrap text-white hover:underline'
						>
							{track.name}
						</a>
					</h1>
					<h1 className='flex flex-col overflow-hidden text-gray-400'>
						{track.artists.map(artist => {
							return (
								<a
									key={artist.id}
									href={artist.external_urls.spotify}
									target='_blank'
									rel='noopener noreferrer'
									className='overflow-hidden text-ellipsis whitespace-nowrap text-sm hover:underline'
								>
									{artist.name}
								</a>
							);
						})}
					</h1>
				</div>
			</div>
			<div className='h-fit w-fit'>
				<a
					href={track.external_urls.spotify}
					target='_blank'
					rel='noopener noreferrer'
					className='text-white'
					title='Open In Spotify'
				>
					<FaSpotify className='h-7 min-h-7 w-7 min-w-7 fill-[#1ED760]' />
				</a>
			</div>
		</div>
	);
}
