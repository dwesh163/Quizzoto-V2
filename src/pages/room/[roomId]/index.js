import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Menu from '@/components/menu';

function Answers({ results }) {
	const router = useRouter();

	return (
		<div className="relative overflow-x-auto w-full">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead className="sm:text-base text-sm text-gray-900 uppercase dark:text-gray-400">
					<tr>
						<th scope="col" className="sm:px-6 px-0 sm:py-3 py-1 sm:hidden table-cell">
							Results
						</th>
						<th scope="col" className="sm:px-6 px-0 sm:py-3 py-1">
							Quizz
						</th>
						<th scope="col" className="sm:px-6 px-3 sm:py-3 py-1 hidden sm:table-cell">
							Name
						</th>
						<th scope="col" className="sm:px-6 px-3 sm:py-3 py-1 hidden sm:table-cell">
							User
						</th>
						<th scope="col" className="sm:px-6 px-0 sm:py-3 py-1">
							Points
						</th>
					</tr>
				</thead>
				<tbody className="w-full">
					{results?.map((result, index) => (
						<tr key={'answers-' + index} className="sm:text-base text-sm cursor-pointer hover:bg-slate-100" onClick={() => router.push('/result/' + result.id)}>
							<th scope="row" className="sm:px-6 sm:py-4 px-3 py-2 font-medium text-gray-900 hidden sm:table-cell">
								{result.quiz.title}
							</th>
							<td className="sm:px-6 sm:py-4 px-3 py-2 hidden sm:table-cell">{result.user ? result.user.name : ''}</td>
							<td className="sm:px-6 sm:py-4 px-3 py-2 hidden sm:table-cell">
								<div className="flex items-center sm:space-x-4 space-x-1 rtl:space-x-reverse h-full cursor-pointer">
									<div className="flex-shrink-0">
										<img className="sm:w-8 sm:h-8 w-4 h-4 rounded-full" src={result.user ? result.user.image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="truncate">{result.user ? result.user.username : 'anonymous'}</p>
									</div>
								</div>
							</td>
							<td className="sm:px-6 sm:py-4 px-3 py-2 hidden sm:table-cell">{result.points}</td>
							<td className="sm:hidden py-2 table-cell">
								<div className="flex gap-2">
									<div className="h-full flex items-center align-middle">
										<img className="sm:w-8 sm:h-8 w-12 h-12 rounded-full" src={result.user ? result.user.image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'} />
									</div>
									<div className={'flex ' + (result?.user?.name ? 'flex-col' : 'items-center')}>
										{result?.user?.name ? <p className="font-medium">{result?.user?.name}</p> : <></>}
										<p className={!result?.user?.name ? 'font-medium' : 'text-gray-500'}>{result?.user ? result?.user?.username : 'anonymous'}</p>
									</div>
								</div>
							</td>
							<td className="sm:hidden py-2 table-cell"> {result.quiz.title}</td>
							<td className="sm:hidden py-2 table-cell">{result.points}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function Quizzes({ quizzes }) {
	const router = useRouter();

	return (
		<div className="relative overflow-x-auto w-full">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead className="sm:text-base text-sm text-gray-900 uppercase dark:text-gray-400">
					<tr>
						<th scope="col" className="sm:px-6 px-0 sm:py-3 py-1">
							Title
						</th>
					</tr>
				</thead>
				<tbody className="w-full">
					{quizzes?.map((quiz, index) => (
						<tr key={'quizzes-' + index} className="sm:text-base text-sm cursor-pointer hover:bg-slate-100" onClick={() => router.push('/quiz/' + quiz.slug)}>
							<th scope="row" className="sm:px-6 sm:py-4 px-3 py-2 font-medium text-gray-900 hidden sm:table-cell">
								{quiz.title}
							</th>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default function Rooms() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [room, setRoom] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState('results');

	const pages = ['results', 'quizzes', 'stats'];

	useEffect(() => {
		if (!router.query.roomId) {
			return;
		}
		fetch(`/api/room/` + router.query.roomId)
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData.error != 'Not Found') {
					setRoom(jsonData);

					setIsLoading(false);
				} else {
					setRoom('404');
				}
			});
	}, [router.query.roomId]);

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
						{room != '404' ? (
							<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
							</svg>
						) : (
							<p className="mt-4">Rooms not Found</p>
						)}
					</div>
				) : (
					<div className="flex mt-20 md:bg-[#fcfcfc] bg-white flex-col max-w-6xl mx-auto items-center justify-between md:px-6 px-4 lg:px-8">
						<div className="w-full flex h-12 select-none mb-4">
							{pages.map((page, index) => (
								<div key={'page-' + index} className="w-1/3">
									<div key={'page-' + page} className="w-full h-full pb-1 flex cursor-pointer justify-center items-center hover:bg-gray-100" onClick={() => setCurrentPage(page)}>
										{page.substring(0, 1).toUpperCase() + page.substring(1)}
									</div>
									{currentPage == page && <div className="bg-sky-600 bg-opacity-90 w-full h-1 mt-[-0.25rem]"></div>}
								</div>
							))}
						</div>

						{(() => {
							switch (currentPage) {
								case 'results':
									return <Answers results={room?.results} />;
								case 'quizzes':
									return <Quizzes quizzes={room?.quizzes} />;
								default:
									return null;
							}
						})()}
					</div>
				)}
			</main>
		</>
	);
}
