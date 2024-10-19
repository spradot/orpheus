import { getAccessToken } from '@/util/utils';
import type { GetRecommendationsQuery, GetRecommendationsResponse, TrackObject } from 'spotify-api-types';

/**
 * POST `/api/recommendations`
 */
export interface ApiRecommendationsResponse {
	tracks: Array<TrackObject>;
}

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
		throw new Error(error);
	}
	const data: GetRecommendationsResponse = await res.json();
	const resBody: ApiRecommendationsResponse = { tracks: data.tracks as TrackObject[] };
	return Response.json(resBody);
}
