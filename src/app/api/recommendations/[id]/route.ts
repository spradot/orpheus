import { redis } from '@/util/utils';
import type { TrackObject } from 'spotify-api-types';
import { type ApiPostRecommendationsResponse } from '../route';

export async function GET(request: Request, { params }: { params: { id: string } }) {
	console.log(params.id);
	const data = await redis.get<{
		id: string;
		tracks: Array<TrackObject>;
	}>(params.id);
	return Response.json(data);
}

/**
 * GET `/api/recommendations/:id`
 */
export type ApiGetRecommendationsResponse = ApiPostRecommendationsResponse;
