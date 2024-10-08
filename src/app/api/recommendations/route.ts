import { getAccessToken } from '@/util/utils';
import type { GetRecommendationsResponse, TrackObject } from 'spotify-api-types';

/**
 * GET `/api/recommendations`
 */
export interface ApiRecommendationsResponse {
	tracks: Array<TrackObject>;
}

export async function GET(request: Request) {
	const artists = new URL(request.url).searchParams.get('artists');
	const genres = new URL(request.url).searchParams.get('genres');
	const tracks = new URL(request.url).searchParams.get('tracks');
	const url = encodeURI(
		`https://api.spotify.com/v1/recommendations?seed_artists=${artists}&seed_genres=${genres}&seed_tracks=${tracks}&limit=100`,
	);
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	const data: GetRecommendationsResponse = await res.json();
	const resBody: ApiRecommendationsResponse = { tracks: data.tracks as TrackObject[] };
	return Response.json(resBody);
}
