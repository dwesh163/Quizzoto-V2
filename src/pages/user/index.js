import Head from 'next/head';
import Header from '@/components/header';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function User() {
	const router = useRouter();

	const [users, setUsers] = useState({});
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPage] = useState(5);
	const [serverSearch, setServerSearch] = useState('');

	function fetchData() {
		if (users[currentPage - 1] && serverSearch == search) {
			return;
		}

		setIsLoading(true);
		fetch(`/api/user/?page=${currentPage}&search=${search}`)
			.then((response) => response.json())
			.then((jsonData) => {
				setUsers(jsonData.users);
				setServerSearch(jsonData.search);
				setTotalPage(jsonData.totalPages);
				if (currentPage > jsonData.totalPages) {
					router.push('?page=' + jsonData.totalPages);
					setCurrentPage(jsonData.totalPages);
				} else {
					router.push('?page=' + jsonData.page);
					setCurrentPage(jsonData.page);
				}
				setTimeout(() => {
					setIsLoading(false);
				}, 500);
			});
	}

	useEffect(() => {
		fetchData();
	}, [currentPage]);

	useEffect(() => {
		if (!router.query.page || router.query.page === currentPage) {
			return;
		}

		setCurrentPage(parseInt(router.query.page));
	}, [router.query.page]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			router.push('?page=' + (currentPage - 1) + '#');
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			router.push('?page=' + (currentPage + 1) + '#');
		}
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
		<ul className="divide-y mt-3 divide-gray-200 w-full px-6">
			{users[currentPage - 1] &&
				users[currentPage - 1].map((user, index) => (
					<li key={index + '-user-list'} className="py-1.5 sm:py-2 h-14" onClick={() => router.push('/user/' + user.username)}>
						<div className="flex items-center space-x-4 rtl:space-x-reverse h-full cursor-pointer">
							<div className="flex-shrink-0">
								<img className="w-8 h-8 rounded-full" src={user.image} alt={user.username} />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">{user.name ? user.name : user.username}</p>
								<p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.name ? '@' + user.username : ''}</p>
							</div>
							<div className="inline-flex items-center text-base font-semibold text-gray-900">{user.statistics.points.length >= 4 ? user.statistics.points.slice(0, -3) + 'K' : user.statistics.points} PTS</div>
						</div>
					</li>
				))}
		</ul>
	);

	const noUserMatchMessage = <p className="text-black h-[calc(100vh-7rem-94px)] flex justify-center items-center">No user match</p>;

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
							<input type="search" name="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 md:rounded-lg rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search Mockups, Logos..." required value={search} onChange={handleSearchChange} />
							<button type="submit" onClick={() => fetchData()} className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
								Search
							</button>
						</div>
					</div>
					{isLoading ? loadingSpinner : users !== 'none' ? userList : noUserMatchMessage}
					<div className="flex items-center md:gap-4 gap-1 my-4 md:absolute md:bottom-0">
						<button disabled={currentPage === 1 || isLoading} onClick={handlePreviousPage} className={'flex justify-end md:w-36 w-24 gap-1 md:px-6 px-2 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase transition-all rounded-lg select-none hover:text-gray-900/90 active:text-gray-900/80 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ' + (users == 'none' ? 'hidden' : '')} type="button">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-4 h-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
							</svg>
							Previous
						</button>
						<div className="flex items-center md:gap-2">
							{(() => {
								const buttons = [];

								let startPage = Math.max(1, currentPage - 2);
								let endPage = Math.min(totalPages, startPage + 4);

								if (endPage - startPage < 4) {
									startPage = Math.max(1, endPage - 4);
								}

								for (let i = startPage; i <= endPage; i++) {
									buttons.push(
										<button key={i + '-switch-page'} className={`relative h-10 md:max-h-[40px] max-h-[25px] w-10 md:max-w-[40px] max-w-[25px] select-none md:rounded-lg rounded-md text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 ${i === currentPage ? 'bg-sky-500 bg-opacity-90 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none' : ''} ${i === currentPage ? 'disabled:pointer-events-none disabled:opacity-90 disabled:shadow-none' : ''}`} type="button" onClick={() => setCurrentPage(i)} disabled={isLoading || i === currentPage}>
											<span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">{i}</span>
										</button>
									);
								}

								return buttons;
							})()}
						</div>
						<button disabled={currentPage === totalPages || isLoading} onClick={handleNextPage} className={'flex items-center md:w-36 w-24 gap-1 md:px-6 px-2 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:text-gray-900/90 active:text-gray-900/50 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ' + (users == 'none' ? 'hidden' : '')} type="button">
							Next
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className="w-4 h-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
							</svg>
						</button>
					</div>
				</div>
			</main>
		</>
	);
}
