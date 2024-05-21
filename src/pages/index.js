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
					<div className="text-center py-16 md:py-24">
						<h1 className="text-5xl px-5 md:text-7xl font-extrabold leading-tighter tracking-tighter mb-4 aos-init aos-animate" data-aos="zoom-y-out">
							Create and play on <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-teal-400">QUIZZOTO</span>
						</h1>
						<div className="max-w-3xl px-5 mx-auto">
							<p className="sm:text-xl text-xs text-gray-600 mb-8 aos-init aos-animate" data-aos="zoom-y-out" data-aos-delay="150">
								Quizzoto is a website dedicated to the creation and participation in online quizzes.
							</p>
							<div className="max-w-xs mx-auto sm:max-w-none select-none flex justify-center aos-init aos-animate gap-4" data-aos="zoom-y-out" data-aos-delay="300">
								<div>
									<a onClick={() => router.push('/quiz')} className="btn cursor-pointer px-6 py-3 rounded-lg text-white bg-sky-500 hover:bg-sky-600 w-full mb-4 sm:w-auto sm:mb-0">
										Start quizz
									</a>
								</div>
								<div>
									<a onClick={() => router.push('/what')} className="btn cursor-pointer px-6 py-3 rounded-lg text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4">
										Learn more
									</a>
								</div>
							</div>
						</div>
					</div>
					<h3 className="px-5 text-3xl text-gray-800 font-bold text-center mb-2">Popular quizzes</h3>
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
										<div role="status" className="max-w-sm animate-pulse">
											<div className="h-2 bg-gray-200 rounded-full w-32 mb-2.5"></div>
											<div className="h-2.5 bg-gray-200 rounded-full max-w-[360px] mb-4"></div>
											<span className="sr-only">Loading...</span>
										</div>
									)}
								</div>
								<div className="grid gap-4 col-start-1 col-end-3 row-start-1">
									<div className="relative w-full h-52 lg:h-52">
										{quiz.image && (
											<div className="absolute rounded-lg inset-0 overflow-hidden">
												<img src={quiz.image} className="w-full h-full object-cover rounded-lg" loading="lazy" />
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
