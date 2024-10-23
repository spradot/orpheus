import { redis } from '@/util/utils';
import { type RecommendedationData } from '../route';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await redis.get<RecommendedationData>(id);
	return Response.json(data);
}

/**
 * GET `/api/recommendations/:id`
 */
export type ApiGetRecommendationsResponse = RecommendedationData | null;
