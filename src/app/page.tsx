import { getAccessToken } from '@/util/utils';
import { SearchArtist } from './SearchArtist';
import { SearchGenre } from './SearchGenre';
import { SearchTrack } from './SearchTrack';
import { SearchTrackAttribute } from './SearchTrackAttribute';
import { SubmitQuery } from './SubmitQuery';

const REVALIDATE_TIME = 1 * 24 * 60 * 60; // Days * Hours * Minutes * Seconds

export default async function Home() {
	const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
		next: { revalidate: REVALIDATE_TIME },
	});
	const data: SpotifyGenreResponse = await res.json();

	return (
		<div className='mt-4 flex flex-col items-center gap-x-2 gap-y-8 px-4 py-4'>
			<div className='flex w-full flex-col items-center gap-y-4 xl:flex-row xl:items-baseline xl:justify-center xl:gap-x-4'>
				<SearchArtist className='h-fit w-96' />
				<SearchTrack />
				<SearchGenre genres={data.genres} />
				<SearchTrackAttribute />
			</div>
			<SubmitQuery />
		</div>
	);
}

export interface SpotifyGenreResponse {
	genres: Array<string>;
}
