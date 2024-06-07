import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Menu from '@/components/menu';
import Confetti from '@/components/confetti';
import ResultsList from '@/components/results';

export default function ResultsPage() {
	const router = useRouter();
	const [resultId, setResultId] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		if (router.query.resultId) {
			setResultId(router.query.resultId);
		}
	}, [router.query.resultId]);

	return (
		<>
			<Head>
				<title>Results - Quizzoto</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				<div className="flex mt-20 md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-4 mx-auto items-center justify-between md:flex-row md:px-6 lg:px-8">
					<ResultsList resultId={resultId} isLoading={isLoading} setIsLoading={setIsLoading} />
				</div>
			</main>
		</>
	);
}
