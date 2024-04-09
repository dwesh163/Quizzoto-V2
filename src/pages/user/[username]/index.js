import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function User() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [user, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!router.query.username) {
			return;
		}
		fetch(`/api/user/` + router.query.username)
			.then((response) => response.json())
			.then((jsonData) => {
				setUser(jsonData);
				setIsLoading(false);
			});
	}, [router.query.username]);

	return (
		<>
			<Head>
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				{isLoading ? (
					<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:flex-row md:px-6 lg:px-8 h-[100vh]">
						<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
					</div>
				) : (
					<div className="flex mt-20 md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-between md:flex-row md:px-6 lg:px-8">
						<div className="relative max-w-350px w-full bg-white md:bg-card-texture bg-no-repeat bg-top md:rounded-2xl md:shadow-2xl">
							<div className="flex flex-col items-center justify-center pt-6 sm:pt-8">
								<img src={user.image} alt="Profile Picture" className="rounded-full border-4 bg-white border-white w-32" />
								<h1 className="font-bold font-sans text-secondary mt-2">{user.name ? user.name : user.username}</h1>
								<h2 className="text-text font-sans text-sm text-gray-500">{user.name ? '@' + user.username : ''}</h2>
							</div>

							<div className="flex justify-evenly mt-6 py-6 border border-neutral border-r-0 border-b-0 border-l-0">
								<div className="text-center">
									<h3 className="font-bold text-secondary">{user.statistics.points.length >= 4 ? user.statistics.points.slice(0, -3) + 'K' : user.statistics.points}</h3>
									<p className="text-xs text-text tracking-widest">{user.statistics.points.length > 1 ? 'Points' : 'Point'}</p>
								</div>
								<div className="text-center">
									<h3 className="font-bold text-secondary">{user.statistics.quizzes.length >= 4 ? user.statistics.quizzes.slice(0, -3) + 'K' : user.statistics.quizzes}</h3>
									<p className="text-xs text-text tracking-widest">{user.statistics.quizzes.length > 1 ? 'Quizzes' : 'Quiz'}</p>
								</div>
								<div className="text-center">
									<h3 className="font-bold text-secondary">{user.statistics.stars}</h3>
									<p className="text-xs text-text tracking-widest">{user.statistics.stars > 1 ? 'Stars' : 'Star'}</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</>
	);
}
