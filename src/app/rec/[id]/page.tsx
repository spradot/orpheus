import { Recommendations } from '@/components/Recommendations';

export default async function RecommendationsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return (
		<div className='flex h-screen flex-col'>
			<Recommendations id={id} />
		</div>
	);
}
