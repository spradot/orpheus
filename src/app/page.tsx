import { getAccessToken } from '@/util/utils';
import { type GetRecommendationGenresResponse } from 'spotify-api-types';
import { SearchArtist } from './SearchArtist';
import { SearchGenre } from './SearchGenre';
import { SearchTrack } from './SearchTrack';
import { SearchTrackAttribute } from './SearchTrackAttribute';
import { SubmitQuery } from './SubmitQuery';

// const REVALIDATE_TIME = 1 * 24 * 60 * 60; // Days * Hours * Minutes * Seconds
// One week in seconds (60 * 60 * 24 * 7 = 604800 seconds)
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

async function fetchGenres(): Promise<GetRecommendationGenresResponse['genres']> {
	const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
		next: {
			revalidate: ONE_WEEK_IN_SECONDS,
		},
	});
	if (!res.ok) {
		const error = await res.text();
		console.log(error);
	}
	const data: GetRecommendationGenresResponse = await res.json();
	return data.genres;
}

export default async function Home() {
	const genres = await fetchGenres();

	return (
		<div className='mt-4 flex flex-col items-center gap-x-2 gap-y-8 px-4 py-4'>
			<div className='flex w-full flex-col items-center gap-y-4 xl:flex-row xl:items-baseline xl:justify-center xl:gap-x-4'>
				<SearchArtist className='h-fit w-96' />
				<SearchTrack />
				<SearchGenre genres={genres} />
				<SearchTrackAttribute />
			</div>
			<SubmitQuery />
		</div>
	);
}
