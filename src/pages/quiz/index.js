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
	const [order, setOrder] = useState('date');
	const [columnCount, setColumnCount] = useState(3);

	function fetchData() {
		if (serverSearch == search && search != '') {
			return;
		}

		fetch(`/api/quiz/?limit=${limit}&search=${search}&order=${order}`)
			.then((response) => response.json())
			.then((jsonData) => {
				setQuizzes(jsonData.quizzes);
				setServerSearch(jsonData.search);
				setIsLoading(false);
			});
	}

	useEffect(() => {
		fetchData();
	}, [limit]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			fetchData();
		} else if (event.key === 'Escape') {
			setSearch('');
			setIsLoading(true);

			fetch(`/api/quiz/?limit=${limit}&search=&order=${order}`)
				.then((response) => response.json())
				.then((jsonData) => {
					setQuizzes(jsonData.quizzes);
					setServerSearch(jsonData.search);
					setIsLoading(false);
				});
		}
	};

	useEffect(() => {
		function handleResize() {
			setColumnCount(window.innerWidth >= 640 ? 3 : 1);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const loadingSkeleton = (
		<div className="divide-y mt-3 px-4 divide-gray-200 w-full flex flex-wrap justify-between items-center">
			{Array.from({ length: limit * 6 })
				.map((_, index) => (
					<div key={index + '-quiz-list'} className="mb-5 w-full h-full cursor-pointer rounded overflow-hidden shadow-lg">
						<div class="w-full mb-5 h-full animate-pulse">
							<div class="mb-5 w-full h-full cursor-pointer rounded overflow-hidden shadow-lg">
								<div class="w-full sm:h-48 h-52 bg-gray-200"></div>
								<div class="sm:px-6 sm:py-4 px-4 py-3">
									<div class="flex justify-between mb-2">
										<div class="h-6 bg-gray-200 w-3/4"></div>
										<div class="flex items-center h-6 w-6 bg-gray-200"></div>
									</div>
									<div class="h-12 bg-gray-200 rounded w-full mt-1"></div>
								</div>
								<div class="px-6 pt-4 flex flex-wrap">
									<span class="inline-block w-32 bg-gray-200 rounded-full h-6 px-3 mr-2 mb-2"></span>
									<span class="inline-block w-16 bg-gray-200 rounded-full h-6 px-3 mr-2 mb-2"></span>
									<span class="inline-block w-24 bg-gray-200 rounded-full h-6 px-3 mr-2 mb-2"></span>
								</div>
							</div>
						</div>
					</div>
				))
				.reduce((rows, div, index) => {
					if (index % columnCount === 0) rows.push([]);
					rows[rows.length - 1].push(div);
					return rows;
				}, [])
				.map((row, rowIndex) => (
					<div key={rowIndex} className="flex justify-between w-full border-none">
						{row.map((col, colIndex) => (
							<div key={colIndex} className="sm:w-[32%] w-full mb-5 min-h-[30rem]">
								{col}
							</div>
						))}
					</div>
				))}
		</div>
	);

	const userList = (
		<div className="divide-y mt-3 px-4 divide-gray-200 w-full flex flex-wrap justify-between items-center">
			{quizzes != 'none' &&
				quizzes
					?.map((quiz, index) => (
						<div onClick={() => router.push('/quiz/' + quiz.slug)} key={index + '-quiz-list'} className="mb-5 w-full h-full cursor-pointer rounded overflow-hidden shadow-lg">
							<img className="w-full sm:h-48 h-52 object-cover" src={quiz.image} alt={quiz.title} />
							<div className="sm:px-6 sm:py-4 px-4 py-3">
								<div className="flex justify-between mb-2">
									<div className="font-bold text-xl">{quiz.title}</div>
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
								</div>
								<p className="text-gray-700 text-base overflow-hidden" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
									{quiz.description}
								</p>
							</div>
							<div className="px-6 pt-4">
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
								<div key={colIndex} className="sm:w-[32%] w-full mb-5 min-h-[30rem]">
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
						<label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
						<div className="relative">
							<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
								<svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
									<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
								</svg>
							</div>
							<input type="search" name="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 md:rounded-lg rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Search quizzes" required value={search} onChange={handleSearchChange} onKeyDown={handleKeyDown} />
							<button onClick={() => fetchData()} className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 absolute end-2.5 bottom-2.5 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">
								Search
							</button>
						</div>
					</div>
					{isLoading ? typeof window != undefined ? loadingSkeleton : <></> : quizzes !== 'none' ? userList : noQuizMatchMessage}
					{!isLoading && quizzes !== 'none' ? (
						<button
							onClick={() => {
								setLimit(limit + 1);
								fetchData();
							}}
							type="button"
							className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-5 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none">
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
