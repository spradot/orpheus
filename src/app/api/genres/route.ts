import { getAccessToken } from '@/util/utils';
import type { GetRecommendationGenresResponse } from 'spotify-api-types';

// One week in seconds (60 * 60 * 24 * 7 = 604800 seconds)
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

/**
 * GET `/api/genres`
 */
export interface ApiGenresResponse {
	genres: Array<string>;
}

export async function GET() {
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
		throw new Error(error);
	}
	const data: GetRecommendationGenresResponse = await res.json();
	const resBody: ApiGenresResponse = data;
	return Response.json(resBody);
}
