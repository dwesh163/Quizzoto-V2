import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getRedirectUrl } from '../../../lib/links';
import Head from 'next/head';
import Header from '@/components/header';

export default function Link({ quizzes, room, error }) {
	const router = useRouter();

	useEffect(() => {
		if (quizzes && router && localStorage && !error && quizzes.length == 1) {
			router.push('/quiz/' + quizzes[0].slug + '/start');
			localStorage.setItem('room', JSON.stringify(room));
		}
	}, [quizzes, router]);
	return (
		<>
			<Head>
				<title>Join - Quizzoto</title>
				<meta name="description" content="Join the quiz on Quizzoto" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8">
					{error ? (
						<div className="flex justify-center items-center h-[calc(100vh-76px)]">
							<p className="mt-4">{error}</p>
						</div>
					) : (
						<>
							{quizzes.length == 1 ? (
								<></>
							) : (
								<div className="flex flex-col gap-3 w-full sm:w-auto md:w-1/2 lg:w-1/3 xl:w-1/3 mt-32" role="none">
									<h2 class="text-4xl font-bold text-center text-gray-950">{room.title}</h2>
									<h6 class="text-lg text-center text-gray-600 sm:mb-3">{room.instruction}</h6>
									{quizzes.map((quiz, index) => (
										<div
											key={index}
											onClick={() => {
												if (localStorage) {
													router.push('/quiz/' + quiz.slug + '/start');
													localStorage.setItem('room', JSON.stringify(room));
												}
											}}
											className="border border-gray-200 hover:bg-zinc-200 rounded-md shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer">
											<span className="flex items-center">
												<span className="text-sm leading-tight md:text-base md:leading-normal flex">
													<span className="text-gray-900 font-medium" id="headlessui-label-2">
														{quiz.title}
													</span>
												</span>
											</span>

											<span className="border-transparent border-2 rounded-lg absolute inset-0 pointer-events-none" aria-hidden="true"></span>
										</div>
									))}
								</div>
							)}
						</>
					)}
				</div>
			</main>
		</>
	);
}

export async function getServerSideProps(context) {
	const { slug } = context.params;

	const { quizzes, room, error } = await getRedirectUrl(slug);

	return {
		props: {
			quizzes: error ? error : quizzes,
			room: error ? error : room,
			error: error ? error : null,
		},
	};
}
