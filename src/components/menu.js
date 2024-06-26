import { useRouter } from 'next/router';

export default function Menu({ title }) {
	const router = useRouter();
	return (
		<div className="flex justify-between items-center">
			<nav className="flex sm:mb-4 md:ml-0 ml-5" aria-label="Breadcrumb">
				<ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
					<li className="inline-flex items-center">
						<a onClick={() => router.push('/')} className="cursor-pointer inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
							<svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
								<path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
							</svg>
							Home
						</a>
					</li>
					<li>
						<div className="flex items-center">
							<svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
								<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
							</svg>
							<a onClick={() => router.push('/quiz')} className="cursor-pointer ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
								Quizzes
							</a>
						</div>
					</li>
					<li aria-current="page">
						<div className="flex items-center">
							<svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
								<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
							</svg>
							<span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">{title}</span>
						</div>
					</li>
				</ol>
			</nav>
		</div>
	);
}
