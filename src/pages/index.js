import Head from 'next/head';
import Header from '@/components/header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
	const [quizzes, setQuizzes] = useState([{}, {}, {}]);

	const router = useRouter();

	useEffect(() => {
		fetch('/api/')
			.then((response) => response.json())
			.then((jsonData) => {
				setQuizzes(jsonData.quizzes);
			});
	}, []);

	return (
		<>
			<Head>
				<title>QuizotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				<div className="max-w-6xl mt-[5rem] sm:mt-24 pb-5 mx-auto md:px-6 lg:px-8 bg-white md:bg-[#fcfcfc]">
					<h3 class="px-5 text-3xl text-gray-800 font-bold">Popular quizzes</h3>
					<div className="px-5 py-2 flex lg:flex-nowrap flex-wrap gap-4 lg:gap-2 overflow-scroll">
						{quizzes.map((quiz) => (
							<div onClick={() => router.push('/quiz/' + quiz.slug)} className="cursor-pointer grid grid-cols-1 w-full lg:w-1/3">
								<div className={'relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg' + (quiz.image ? ' bg-gradient-to-t from-black/75 via-black/0' : ' bg-gray-100')}>
									{quiz.title ? (
										<>
											<h1 className="mt-1 text-lg font-semibold z-20 text-white">{quiz.title}</h1>
											<p className="text-sm leading-4 font-medium z-20 text-white">Quiz</p>
										</>
									) : (
										<div role="status" class="max-w-sm animate-pulse">
											<div class="h-2 bg-gray-200 rounded-full w-32 mb-2.5"></div>
											<div class="h-2.5 bg-gray-200 rounded-full max-w-[360px] mb-4"></div>
											<span class="sr-only">Loading...</span>
										</div>
									)}
								</div>
								<div className="grid gap-4 col-start-1 col-end-3 row-start-1">
									<div className="relative w-full h-52 lg:h-52">
										{quiz.image && (
											<div className="absolute rounded-lg inset-0 overflow-hidden">
												<img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover rounded-lg" loading="lazy" />
												<div className="rounded-lg absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
