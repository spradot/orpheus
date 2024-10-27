import { Limit } from '@/components/Limit';
import { SearchArtist } from '@/components/SearchArtist';
import { SearchGenre } from '@/components/SearchGenre';
import { SearchTrack } from '@/components/SearchTrack';
import { SearchTrackAttribute } from '@/components/SearchTrackAttribute';
import { SubmitQuery } from '@/components/SubmitQuery';
import { getAccessToken } from '@/util/server';
import { unstable_cache } from 'next/cache';
import { type GetRecommendationGenresResponse } from 'spotify-api-types';

async function fetchGenres(): Promise<GetRecommendationGenresResponse['genres']> {
	const url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		const error = await res.text();
		console.log(error);
	}
	const data: GetRecommendationGenresResponse = await res.json();
	return data.genres;
}

const getCachedGenres = unstable_cache(async () => fetchGenres(), ['cached-genres'], {
	tags: ['cached-genres'],
});

export default async function Home() {
	const genres = await getCachedGenres();

	return (
		<div className='flex flex-col items-center gap-x-2 gap-y-8 px-4 py-5'>
			<div className='flex w-full flex-col items-center gap-y-4 xl:flex-row xl:flex-wrap xl:items-baseline xl:justify-center xl:gap-x-4'>
				<SearchArtist />
				<SearchTrack />
				<div className='flex w-full flex-col items-center gap-y-4 xl:flex-row xl:items-baseline xl:justify-center xl:gap-x-4'>
					<SearchGenre genres={genres} />
					<div className='flex flex-col items-center gap-y-4'>
						<SearchTrackAttribute />
						<Limit />
					</div>
				</div>
			</div>
			<SubmitQuery />
		</div>
	);
}
