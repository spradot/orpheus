import { getAccessToken } from '@/util/utils';
import { unstable_cache } from 'next/cache';
import type { GetSearchResponse, TrackObject } from 'spotify-api-types';

// One week in seconds (60 * 60 * 24 * 7 = 604800 seconds)
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

/**
 * GET `/api/tracks`
 */
export interface ApiTracksResponse {
	tracks: Array<TrackObject>;
}

async function fetchTracks(query: string): Promise<GetSearchResponse['tracks']> {
	const url = encodeURI(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`);
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		const error = await res.text();
		console.log(error);
	}
	const data: GetSearchResponse = await res.json();
	return data.tracks;
}

const getCachedTracks = unstable_cache(async (query: string) => fetchTracks(query), ['cached-tracks'], {
	tags: ['cached-tracks'],
	revalidate: ONE_WEEK_IN_SECONDS,
});

export async function GET(request: Request) {
	const query = new URL(request.url).searchParams.get('query')!;
	const tracks: GetSearchResponse['tracks'] = await getCachedTracks(query);
	const resBody: ApiTracksResponse = { tracks: tracks.items };
	return Response.json(resBody);
}
