import { getAccessToken } from '@/util/utils';
import { unstable_cache } from 'next/cache';
import type { ArtistObject, GetSearchResponse } from 'spotify-api-types';

// One week in seconds (60 * 60 * 24 * 7 = 604800 seconds)
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

/**
 * GET `/api/artists`
 */
export interface ApiArtistsResponse {
	artists: Array<ArtistObject>;
}

async function fetchArtist(query: string): Promise<GetSearchResponse['artists']> {
	const url = encodeURI(`https://api.spotify.com/v1/search?q=${query}&type=artist&limit=10`);
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		const error = await res.text();
		console.log(error);
	}
	const data: GetSearchResponse = await res.json();
	return data.artists;
}

const getCachedArtists = unstable_cache(async (query: string) => fetchArtist(query), ['cached-artists'], {
	tags: ['cached-artists'],
	revalidate: ONE_WEEK_IN_SECONDS,
});

export async function GET(request: Request) {
	const query = new URL(request.url).searchParams.get('query')!;
	const artists: GetSearchResponse['artists'] = await getCachedArtists(query);
	const resBody: ApiArtistsResponse = { artists: artists.items };
	return Response.json(resBody);
}
