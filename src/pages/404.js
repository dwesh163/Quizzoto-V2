import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import packageJson from '/package.json';
import Head from 'next/head';

export default function NotFound() {
	return (
		<>
			<Head>
				<title>404 - Quizoto</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfc]">
					<div className="sm:w-full p-8">
						<h1 className="font-semibold rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center mb-6 tracking-tighter text-sky-600 text-5xl">QUIZZOTO</h1>
						<h2 className="text-center sm:text-xl text-base text-gray-900 mb-8">404 Not found</h2>
					</div>
					<footer className="absolute bottom-4 text-xs sm:text-base">
						{packageJson.name} - {packageJson.version}
					</footer>
				</div>
			</main>
		</>
	);
}
