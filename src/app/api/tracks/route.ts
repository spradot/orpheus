import { getAccessToken } from '@/util/utils';
import type { GetSearchResponse, TrackObject } from 'spotify-api-types';

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
	});
	const data: GetSearchResponse = await res.json();
	const resBody: ApiTracksResponse = { tracks: data.tracks.items };
	return Response.json(resBody);
}
