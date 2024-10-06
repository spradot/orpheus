import { Recommendations } from './Recommendations';
import { SearchArtist } from './SearchArtist';
import { SubmitQuery } from './SubmitQuery';

export default function Home() {
	return (
		<div className='flex flex-col items-center gap-x-2 gap-y-6 px-4 py-4'>
			<div id='query_options'>
				<SearchArtist className='w-96' />
			</div>
			<SubmitQuery />
			<Recommendations />
		</div>
	);
}
