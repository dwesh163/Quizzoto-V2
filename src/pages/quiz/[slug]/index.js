import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Menu from '@/components/menu';
import ResultsList from '@/components/results';

function BestResultsList({ results }) {
	return (
		<div className="mt-2 w-full">
			<section className="text-center lg:text-left w-full">
				<div className="grid gap-3 grid-cols-5 md:grid-cols-5 xl:gap-x-3 w-full">
					{results?.map((result, index) => (
						<div className="mb-6 lg:mb-0">
							<div className="relative block rounded-lg bg-white">
								<div className="flex-row items-center lg:flex">
									<div className="w-full shrink-0 grow-0 basis-auto lg:w-16 lg:pr-2">
										<img src={result.user.image} alt="User image" className="sm:mb-0 mb-2 w-full rounded-md" />
									</div>
									<div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
										<h5 className="mb-0 sm:text-lg text-xs font-bold">{result.user.username}</h5>
										<p className="mb-0 sm:text-base text-xs text-neutral-500 ">{result.points} Points</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

export default function Quiz() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [quiz, setQuiz] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [results, setResults] = useState([]);

	const show = false;

	useEffect(() => {
		if (!router.query.slug) {
			return;
		}
		fetch(`/api/quiz/` + router.query.slug)
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData != '404') {
					setQuiz(jsonData.quiz);
					console.log(jsonData.results);
					setResults(jsonData.results);
					setIsLoading(false);
				} else {
					setQuiz('404');
				}
			});
	}, [router.query.slug]);

	return (
		<>
			<Head>
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				{isLoading ? (
					<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 h-[100vh]">
						{quiz == '404' ? (
							<p className="mt-4">Quiz not Found</p>
						) : (
							<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
							</svg>
						)}
					</div>
				) : (
					<div className="max-w-6xl mt-[5rem] sm:mt-24 pb-5 mx-auto md:px-6 lg:px-8 bg-white md:bg-[#fcfcfc]">
						<Menu title={quiz.title} />
						<div className="flex flex-col justify-between items-center md:flex-row pt-3 gap-6 h-full bg-white md:bg-[#fcfcfc] md:bg-card-texture bg-no-repeat bg-top md:rounded-2xl md:shadow-xl">
							<div className="md:bg-card-texture h-full w-full bg-no-repeat bg-top p-5 ">
								<div className="mx-auto grid grid-cols-1 w-full lg:gap-x-20 lg:grid-cols-2">
									<div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1">
										<h1 className="mt-1 text-lg font-semibold z-20 text-white sm:text-slate-900 md:text-2xl">{quiz.title}</h1>
										<p className="text-sm leading-4 font-medium z-20 text-white sm:text-slate-500">Quiz</p>
									</div>
									<div className="grid gap-4 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
										<div className="relative w-full h-60 sm:h-72 sm:col-span-4 lg:col-span-full">
											<div className="absolute rounded-lg inset-0 overflow-hidden">
												<img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover rounded-lg" loading="lazy" />
												<div className="rounded-lg absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 sm:hidden"></div>
											</div>
										</div>
									</div>

									<div className="mt-4 text-xs font-medium flex items-center justify-between row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
										<span>
											<div className="flex items-center">
												{Array.from({ length: 5 }).map((_, ratingIndex) =>
													ratingIndex + 1 > Math.round(quiz.rating) ? (
														<svg key={ratingIndex + '-rating'} className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
															<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
														</svg>
													) : (
														<svg key={ratingIndex + '-rating'} className="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
															<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
														</svg>
													)
												)}
											</div>
										</span>
										<span className="mx-3 text-slate-800 items-center flex gap-2">
											<span>{quiz.info.length} Questions</span>
											<span>·</span>
											<span>{quiz.info.points} Points</span>
										</span>
									</div>
									<div className="mt-4 self-center sm:mt-0 lg:mt-6 col-start-1 row-start-3 row-end-4 flex">
										<button onClick={() => router.push(quiz.slug + '/1')} type="button" className="text-white w-full sm:w-fit bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none">
											Start
										</button>
										{quiz?.user?.username == session?.user?.username && (
											<button onClick={() => router.push('/quiz/create/' + quiz.id)} type="button" className="text-white w-fit bg-gray-400 hover:bg-gray-500 focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none flex items-center gap-1">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
													<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
													<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
												</svg>
												<p className="hidden sm:flex">Edit</p>
											</button>
										)}
									</div>
									<p className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-6 lg:row-start-4 lg:col-span-1 dark:text-slate-400">{quiz.description}</p>
								</div>
								{results.length != 0 && show && (
									<div className="sm:mt-12 mt-6 gap-4 flex-col">
										<h5 className="text-lg font-bold text-slate-800">Best results</h5>

										<BestResultsList results={results} />
									</div>
								)}

								{quiz.bestResult && show && (
									<div className="sm:mt-12 mt-0 flex-col">
										<h5 className="text-lg font-bold text-slate-800">My results</h5>
										<div className="flex mt-2 md:bg-[#fcfcfc] flex-col mx-auto items-center justify-between md:flex-row ">
											<ResultsList resultId={quiz.bestResult} />
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</main>
		</>
	);
}
