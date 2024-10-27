import { redis } from '@/util/server';
import { unstable_cache } from 'next/cache';
import type { RecommendedationData } from '../route';

async function fetchRec(id: string) {
	console.log('Fetching Recomendations From Redis');
	const data = await redis.get<RecommendedationData>(id);
	return data;
}

const getCachedRec = unstable_cache(async (id: string) => fetchRec(id), ['cached-red'], { tags: ['cached-rec'] });

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await getCachedRec(id);
	return Response.json(data);
}

/**
 * GET `/api/recommendations/:id`
 */
export type ApiGetRecommendationsResponse = RecommendedationData | null;
