import { getAccessToken } from '@/util/utils';
import { Recommendations } from './Recommendations';
import { SearchArtist } from './SearchArtist';
import { SearchGenre } from './SearchGenre';
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
		<div className='flex flex-col items-center gap-x-2 gap-y-6 px-4 py-4'>
			<div className='flex w-full flex-col items-center gap-y-2 md:flex-row md:items-baseline md:justify-evenly'>
				<SearchArtist className='h-fit w-96' />
				<SearchGenre genres={data.genres} />
			</div>
			<SubmitQuery />
			<Recommendations />
		</div>
	);
}

export interface SpotifyGenreResponse {
	genres: Array<string>;
}
