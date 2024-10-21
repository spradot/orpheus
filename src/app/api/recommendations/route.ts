import { createBase64Id, getAccessToken, redis } from '@/util/utils';
import type { GetRecommendationsQuery, GetRecommendationsResponse, TrackObject } from 'spotify-api-types';

/**
 * POST `/api/recommendations`
 */
export type ApiPostRecommendationsResponse = {
	id: string;
	tracks: Array<TrackObject>;
} | null;

export async function POST(request: Request) {
	const body: GetRecommendationsQuery = await request.json();
	const queryParams = [];
	for (const [key, value] of Object.entries(body)) {
		const typedKey = key as keyof GetRecommendationsQuery;
		const typedValue = value as GetRecommendationsQuery[typeof typedKey];
		if (typeof typedValue === 'undefined' || (Array.isArray(typedValue) && typedValue.length === 0)) continue;
		let queryParam = '';
		if (Array.isArray(typedValue)) {
			queryParam = `${typedKey}=${typedValue.join(',')}`;
		} else {
			queryParam = `${typedKey}=${typedValue}`;
		}
		queryParams.push(queryParam);
	}
	const queryString = queryParams.join('&');
	const url = encodeURI(`https://api.spotify.com/v1/recommendations?${queryString}`);
	console.log(url);
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		const error = await res.text();
		console.log(error);
	}
	const { tracks }: GetRecommendationsResponse = await res.json();
	if (tracks.length === 0) return Response.json(null);
	const id = createBase64Id();
	const resBody: ApiPostRecommendationsResponse = { id, tracks };
	redis.set(id, resBody);
	return Response.json(resBody);
}
