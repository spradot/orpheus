import { FaSpotify } from 'react-icons/fa';
import { MdExplicit } from 'react-icons/md';
import type { TrackObject } from 'spotify-api-types';
import { BlurImage } from './BlurImage';

export function TrackCard({ className, track }: { className?: string; track: TrackObject }) {
	const trackCover = track.album.images[0];

	return (
		<div className={`flex flex-row justify-between gap-y-3 rounded-2xl bg-black px-3 py-4 shadow-md ${className}`}>
			<div className='flex flex-row items-center gap-x-3'>
				<BlurImage
					src={trackCover.url}
					height={trackCover.height!}
					width={trackCover.width!}
					alt={track.name}
					className='h-32 w-32 rounded-lg'
				/>
				<div className='flex flex-col'>
					<h1 className='flex flex-row items-center gap-x-1 text-white'>
						{track.explicit && (
							<span>
								<MdExplicit className='h-6 w-5' />
							</span>
						)}
						<a
							href={track.external_urls.spotify}
							target='_blank'
							rel='noopener noreferrer'
							className='text-white hover:underline'
						>
							{track.name}
						</a>
					</h1>
					<h1 className='flex flex-col gap-x-1 text-gray-400'>
						{track.artists.map(artist => {
							return (
								<a
									key={artist.id}
									href={artist.external_urls.spotify}
									target='_blank'
									rel='noopener noreferrer'
									className='hover:underline'
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
					<FaSpotify className='h-7 w-7 fill-[#1ED760]' />
				</a>
			</div>
		</div>
	);
}
