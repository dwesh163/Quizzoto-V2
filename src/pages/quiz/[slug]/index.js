import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Menu from '@/components/menu';

export default function Quiz() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [quiz, setQuiz] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!router.query.slug) {
			return;
		}
		fetch(`/api/quiz/` + router.query.slug)
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData != '404') {
					setQuiz(jsonData);
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
						<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
						{quiz == '404' ? <p className="mt-4">Quiz not Found</p> : <></>}
					</div>
				) : (
					<div className="h-[calc(100vh-130px)] max-w-6xl mt-24 pb-5 mx-auto md:px-6 lg:px-8 bg-white md:bg-[#fcfcfc]">
						<Menu title={quiz.title} />
						<div className="flex flex-col justify-between items-center md:flex-row gap-6 h-full">
							<div className="bg-white md:bg-card-texture h-full bg-no-repeat bg-top p-5 md:rounded-xl md:shadow-xl w-full">
								<h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-800 md:text-4xl lg:text-5xl ">{quiz.title}</h1>
								<div className="flex justify-evenly mt-6 py-6 border border-neutral border-r-0 border-b-0 border-l-0">
									<div className="text-center">
										<h3 className="font-bold text-secondary">{quiz.info.date}</h3>
										<p className="text-xs text-text tracking-widest">Date</p>
									</div>
									<div className="text-center">
										<h3 className="font-bold text-secondary">{quiz.info.timeLimit}</h3>
										<p className="text-xs text-text tracking-widest">Time Limit</p>
									</div>
									<div className="text-center">
										<h3 className="font-bold text-secondary">{quiz.info.points}</h3>
										<p className="text-xs text-text tracking-widest">Points</p>
									</div>
									<div className="text-center">
										<h3 className="font-bold text-secondary">{quiz.info.length}</h3>
										<p className="text-xs text-text tracking-widest">Questions</p>
									</div>
								</div>
								<button onClick={() => router.push(quiz.slug + '/1')} className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none dark:focus:ring-sky-800">
									START
								</button>
							</div>
							<div className="md:w-[30rem] h-full flex flex-col gap-6">
								<div onClick={() => router.push('/user/' + quiz.user.username)} className="flex flex-col items-center justify-center pt-6 sm:pt-0  w-full h-96 bg-white md:bg-card-texture bg-no-repeat bg-top md:rounded-xl md:shadow-xl cursor-pointer">
									<img src={quiz.user.image} alt="Profile Picture" className="rounded-full border-4 bg-white border-white w-32" />
									<h1 className="font-bold font-sans text-secondary mt-2">{quiz.user.name ? quiz.user.name : quiz.user.username}</h1>
									<h2 className="text-text font-sans text-sm text-gray-500">{quiz.user.name ? '@' + quiz.user.username : ''}</h2>
								</div>
								<div className="flex flex-col h-full items-center pt-6 sm:pt-8 bg-white md:bg-card-texture bg-no-repeat bg-top md:rounded-xl md:shadow-xl w-full">
									<div className="flex items-center justify-between mb-4 w-full px-6">
										<h5 className="text-xl font-bold leading-none text-gray-900">Latest answers</h5>
										<button onClick={() => router.push(router.asPath + '/history')} className="text-sm font-medium text-sky-600 hover:underline">
											View all
										</button>
									</div>
									<div className="flow-root">
										<ul role="list" className="divide-y divide-gray-200">
											<li className="py-3 sm:py-4">
												<div className="flex items-center">
													<div className="flex-shrink-0">
														<img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image" />
													</div>
													<div className="flex-1 min-w-0 ms-4">
														<p className="text-sm font-medium text-gray-900 truncate">Neil Sims</p>
														<p className="text-sm text-gray-500 truncate">email@windster.com</p>
													</div>
													<div className="inline-flex items-center text-base font-semibold text-gray-900">$320</div>
												</div>
											</li>
											<li className="py-3 sm:py-4">
												<div className="flex items-center">
													<div className="flex-shrink-0">
														<img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image" />
													</div>
													<div className="flex-1 min-w-0 ms-4">
														<p className="text-sm font-medium text-gray-900 truncate">Bonnie Green</p>
														<p className="text-sm text-gray-500 truncate">email@windster.com</p>
													</div>
													<div className="inline-flex items-center text-base font-semibold text-gray-900">$3467</div>
												</div>
											</li>
											<li className="py-3 sm:py-4">
												<div className="flex items-center">
													<div className="flex-shrink-0">
														<img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-2.jpg" alt="Michael image" />
													</div>
													<div className="flex-1 min-w-0 ms-4">
														<p className="text-sm font-medium text-gray-900 truncate">Michael Gough</p>
														<p className="text-sm text-gray-500 truncate">email@windster.com</p>
													</div>
													<div className="inline-flex items-center text-base font-semibold text-gray-900">$67</div>
												</div>
											</li>
											<li className="py-3 sm:py-4">
												<div className="flex items-center">
													<div className="flex-shrink-0">
														<img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-4.jpg" alt="Lana image" />
													</div>
													<div className="flex-1 min-w-0 ms-4">
														<p className="text-sm font-medium text-gray-900 truncate">Lana Byrd</p>
														<p className="text-sm text-gray-500 truncate">email@windster.com</p>
													</div>
													<div className="inline-flex items-center text-base font-semibold text-gray-900">$367</div>
												</div>
											</li>
											<li className="pt-3 pb-0 sm:pt-4">
												<div className="flex items-center">
													<div className="flex-shrink-0">
														<img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-5.jpg" alt="Thomas image" />
													</div>
													<div className="flex-1 min-w-0 ms-4">
														<p className="text-sm font-medium text-gray-900 truncate">Thomes Lean</p>
														<p className="text-sm text-gray-500 truncate">email@windster.com</p>
													</div>
													<div className="inline-flex items-center text-base font-semibold text-gray-900">$2367</div>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</>
	);
}
