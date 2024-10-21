import { Recommendations } from '@/app/recommendations/Recommendations';

export default async function RecommendationsPage({ params }: { params: { id: string } }) {
	return (
		<div className='flex h-screen flex-col'>
			<Recommendations id={params.id} />
		</div>
	);
}
