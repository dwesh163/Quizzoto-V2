import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Menu from '@/components/menu';
import Confetti from '@/components/confetti';
import ResultsList from '@/components/results';

export default function ResultsPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [resultId, setResultId] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isContentLoading, setIsContentLoading] = useState(true);
	const [audioPolicy, setAudioPolicy] = useState(false);
	const [showButton, setShowButton] = useState(false);
	const audioRef = useRef();

	function showResults() {
		setAudioPolicy(true);
		if (audioRef.current) {
			audioRef.current.play();
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 2035);
	}

	useEffect(() => {
		(async () => {
			try {
				if (navigator.mediaCapabilities) {
					const policy = await navigator.mediaCapabilities.decodingInfo({
						type: 'file',
						audio: { contentType: 'audio/mp3' },
					});
					if (policy && policy.supported && navigator.getAutoplayPolicy('mediaelement') === 'allowed') {
						showResults();
					} else {
						setAudioPolicy(false);
						setShowButton(true);
					}
				} else {
					setIsLoading(false);
				}
			} catch (error) {
				setAudioPolicy(false);
				setShowButton(true);
			}
		})();
	}, []);

	useEffect(() => {
		if (router.query.resultId) {
			setResultId(router.query.resultId);
		}
	}, [router.query.resultId]);

	return (
		<>
			<Head>
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				<audio ref={audioRef} src="/tadaa.mp3" />
				<div className="flex mt-20 md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-4 mx-auto items-center justify-between md:flex-row md:px-6 lg:px-8">
					{!audioPolicy && showButton && (
						<div className="w-full h-[calc(100vh-130px)] flex items-center justify-center">
							<button onClick={showResults}>Show Results</button>
						</div>
					)}
					{!isLoading && !isContentLoading && <Confetti />}
					{audioPolicy && <ResultsList resultId={resultId} isLoading={isLoading || isContentLoading} setIsLoading={setIsContentLoading} />}
				</div>
			</main>
		</>
	);
}
