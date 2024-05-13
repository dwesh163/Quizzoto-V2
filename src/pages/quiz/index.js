import Head from 'next/head';
import Header from '@/components/header';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function User() {
	const router = useRouter();

	const [quizzes, setQuizzes] = useState([]);
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const [limit, setLimit] = useState(1);
	const [serverSearch, setServerSearch] = useState('');
	const [order, setOrder] = useState('rating');

	function fetchData() {
		if (serverSearch == search && search != '') {
			return;
		}

		fetch(`/api/quiz/?limit=${limit}&search=${search}&order=${order}`)
			.then((response) => response.json())
			.then((jsonData) => {
				setQuizzes(jsonData.quizzes);
				setServerSearch(jsonData.search);
				setTimeout(() => {
					setIsLoading(false);
				}, 500);
			});
	}

	useEffect(() => {
		fetchData();
	}, [limit]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
	};

	const loadingSpinner = (
		<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:flex-row md:px-6 lg:px-8  h-[100vh]">
			<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
				<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
			</svg>
		</div>
	);

	const userList = (
		<div className="divide-y mt-3 px-4 divide-gray-200 w-full flex flex-wrap justify-between items-center">
			{quizzes != 'none' &&
				quizzes
					?.map((quiz, index) => (
						<div onClick={() => router.push('/quiz/' + quiz.slug)} key={index + '-quiz-list'} className="mb-5 w-full h-full cursor-pointer rounded overflow-hidden shadow-lg">
							<img className="w-full" src={quiz.image} alt={quiz.title} />
							<div className="px-6 py-4">
								<div className="flex justify-between mb-2">
									<div className="font-bold text-xl">{quiz.title}</div>
									{quiz.rating != 0 && (
										<div className="flex items-center">
											{Array.from({ length: 5 }).map((_, ratingIndex) =>
												ratingIndex + 1 > Math.round(quiz.rating) ? (
													<svg key={ratingIndex + '-rating-' + index} className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
														<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
													</svg>
												) : (
													<svg key={ratingIndex + '-rating-' + index} className="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
														<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
													</svg>
												)
											)}
										</div>
									)}
								</div>
								<p className="text-gray-700 text-base">{quiz.description}</p>
							</div>
							<div className="px-6 pt-4 pb-2">
								{quiz?.tags?.map((tag, index) => (
									<span key={index + '-tag-list'} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
										#{tag}
									</span>
								))}
							</div>
						</div>
					))
					.reduce((rows, div, index) => {
						const columnCount = window.innerWidth >= 640 ? 3 : 1;
						if (index % columnCount === 0) rows.push([]);
						rows[rows.length - 1].push(div);
						return rows;
					}, [])
					.map((row, rowIndex) => (
						<div key={rowIndex} className="flex justify-between w-full border-none">
							{row.map((col, colIndex) => (
								<div key={colIndex} className="sm:w-[32%] w-full mb-5">
									{col}
								</div>
							))}
						</div>
					))}
		</div>
	);

	const noQuizMatchMessage = <p className="text-black h-[calc(100vh-7rem-94px)] flex justify-center items-center">No Quiz match</p>;

	return (
		<>
			<Head>
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 mt-20">
					<div className="w-full mx-auto px-4 md:px-auto md:mt-12">
						<label className="mb-2 text-sm font-medium text-gray-900 sr-only ">Search</label>
						<div className="relative">
							<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
								<svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
									<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
								</svg>
							</div>
							<input type="search" name="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 md:rounded-lg rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search quizzes" required value={search} onChange={handleSearchChange} />
							<button type="submit" onClick={() => fetchData()} className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 absolute end-2.5 bottom-2.5 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2">
								Search
							</button>
						</div>
					</div>
					{isLoading ? loadingSpinner : quizzes !== 'none' ? userList : noQuizMatchMessage}
					{isLoading ? (
						loadingSpinner
					) : quizzes !== 'none' ? (
						<button
							onClick={() => {
								setLimit(limit + 1);
								fetchData();
							}}
							type="button"
							className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-5 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none ">
							Show more
						</button>
					) : (
						<></>
					)}
				</div>
			</main>
		</>
	);
}
