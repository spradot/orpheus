import { SearchArtist } from './SearchArtist';
import { SearchGenre } from './SearchGenre';
import { SearchTrack } from './SearchTrack';
import { SearchTrackAttribute } from './SearchTrackAttribute';
import { SubmitQuery } from './SubmitQuery';
import type { ApiGenresResponse } from './api/genres/route';

const REVALIDATE_TIME = 1 * 24 * 60 * 60; // Days * Hours * Minutes * Seconds

async function fetchGenres(): Promise<ApiGenresResponse['genres']> {
	const url = process.env.VERCEL_URL
		? 'https://orpheus-music.vercel.app/api/genres'
		: 'http://localhost:3000/api/genres';
	const res = await fetch(url, {
		headers: {
			referer: url,
		},
		next: {
			revalidate: REVALIDATE_TIME,
		},
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(error);
	}
	const data: ApiGenresResponse = await res.json();
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
