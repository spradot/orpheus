import { getAccessToken } from '@/util/utils';
import type { GetSearchResponse, TrackObject } from 'spotify-api-types';

// One week in seconds (60 * 60 * 24 * 7 = 604800 seconds)
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

/**
 * GET `/api/tracks`
 */
export interface ApiTracksResponse {
	tracks: Array<TrackObject>;
}

export async function GET(request: Request) {
	const query = new URL(request.url).searchParams.get('query');
	const url = encodeURI(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`);
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
	const data: GetSearchResponse = await res.json();
	const resBody: ApiTracksResponse = { tracks: data.tracks.items };
	return Response.json(resBody);
}
