import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Menu from '@/components/menu';
import Pie from '@/components/charts/pie';
import Donut from '@/components/charts/donut';
import Area from '@/components/charts/area';

function Stats({ stats }) {
	return (
		<div className="w-full">
			<div className="w-full flex mt-4 flex-wrap justify-between mb-4">
				{stats.numbers.map((stat, index) => (
					<div key={'number-' + index} class="lg:w-[32%] w-full lg:mb-0 mb-4 flex bg-white rounded-lg shadow p-4 md:p-6">
						<div class="flex justify-between w-full">
							<div class="flex items-center">
								<div class="w-12 h-12 rounded-lg bg-gray-100  flex items-center justify-center me-3">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="bi bi-people" viewBox="0 0 16 16">
										<path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
									</svg>
								</div>
								<div>
									<h5 class="leading-none text-2xl font-bold text-gray-900 pb-1">{stat.number}</h5>
									<p class="text-sm font-normal text-gray-500 ">{stat.title}</p>
								</div>
							</div>
							<div>
								<span class="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
									<svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
									</svg>
									{stat.fluctuate}%
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="w-full flex flex-col lg:flex-row justify-between gap-6">
				<div class="lg:w-[32%] w-full bg-white rounded-lg shadow p-4 md:p-6">
					<div class="flex justify-between mb-3">
						<div class="flex justify-center items-center">
							<h5 class="text-xl font-bold leading-none text-gray-900 pe-1">Website traffic</h5>
						</div>
					</div>
					<Donut data={stats.userAgent} />
				</div>

				<div class="lg:w-[66%] bg-white rounded-lg shadow p-4 pb-0 md:p-6 md:pb-0">
					<div class="flex justify-between">
						<div>
							<h5 class="text-xl font-bold leading-none text-gray-900 pe-1">Quizzes</h5>
							<p class="text-base font-normal text-gray-500">answered this days</p>
						</div>
						<div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 text-center">
							12%
							<svg class="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
							</svg>
						</div>
					</div>
					<div id="area-chart"></div>
					<Area data={stats.answersPerHourPerQuiz} answersPer={stats.answersPerHour} />
				</div>
			</div>
			{/* <div>
				<Area data={stats.answersPerPointPerQuiz} answersPer={stats.answersPerPoint} />
			</div> */}
		</div>
	);
}

function Answers({ results }) {
	const router = useRouter();

	const [sortResults, setSortResults] = useState(
		results.map((result) => ({
			...result,
			title: result.quiz.title,
		}))
	);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	const sortData = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}

		const sortedResults = [...sortResults].sort((a, b) => {
			if (a[key] < b[key]) {
				return direction === 'asc' ? -1 : 1;
			}
			if (a[key] > b[key]) {
				return direction === 'asc' ? 1 : -1;
			}
			return 0;
		});

		setSortConfig({ key, direction });
		setSortResults(sortedResults);
	};

	const renderSortArrow = (key) => {
		if (sortConfig.key !== key)
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
					<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
				</svg>
			);
		if (sortConfig.direction === 'asc') {
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
					<path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
				</svg>
			);
		}
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
				<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
			</svg>
		);
	};

	return (
		<div className="relative overflow-x-auto w-full">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead className="sm:text-base text-sm text-gray-900 uppercase dark:text-gray-400 select-none">
					<tr>
						<th scope="col" className="sm:px-6 px-3 sm:py-3 py-1 hidden sm:table-cell cursor-pointer">
							User
						</th>
						<th scope="col" className="sm:px-6 px-0 sm:py-3 py-1 cursor-pointer" onClick={() => sortData('title')}>
							<div className="flex items-center gap-1">
								<p>Quizz </p>
								{renderSortArrow('title')}
							</div>
						</th>
						<th scope="col" className="sm:px-6 px-0 sm:py-3 py-1 text-center cursor-pointer" onClick={() => sortData('points')}>
							<div className="flex items-center gap-1 justify-center">
								<p>Points </p>
								{renderSortArrow('points')}
							</div>
						</th>
					</tr>
				</thead>
				<tbody className="w-full">
					{sortResults?.map((result, index) => (
						<tr key={'answers-' + index} className="sm:text-base text-sm cursor-pointer hover:bg-zinc-100 hover:bg-opacity-95 select-none" onClick={() => router.push('/result/' + result.id)}>
							<th scope="row" className="sm:px-6 sm:py-4 px-3 py-2 font-medium text-gray-900 flex items-center leading-tight transition-all rounded-lg outline-none text-start">
								<div className="grid mr-4 place-items-center">
									<img alt="candice" src={result?.user?.image ? result.user.image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'} className="relative inline-block h-12 w-12 !rounded-full object-cover object-center" />
								</div>
								{result?.user?.name && result?.user?.email ? (
									<div>
										<h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">{result?.user?.name}</h6>
										<p className="block font-sans text-sm -mt-1.5 antialiased font-normal leading-normal text-gray-700">{result?.user?.email}</p>
									</div>
								) : (
									<div>
										<h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">Anonymous</h6>
									</div>
								)}
							</th>
							<th scope="row" className="sm:px-6 sm:py-4 px-3 py-2 font-medium text-gray-900 hidden sm:table-cell">
								{result.quiz.title}
							</th>
							<td className="py-2 text-center">{result.points}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function Quizzes({ oldQuizzes }) {
	const [limit, setLimit] = useState(10);
	const [serverSearch, setServerSearch] = useState('');
	const [order, setOrder] = useState('asc');
	const [quizzes, setQuizzes] = useState([]);
	const [selectedQuizzes, setSelectedQuizzes] = useState(oldQuizzes.map((quiz) => quiz.id));
	const [search, setSearch] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();

	function fetchData() {
		if (serverSearch === search && search !== '') {
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

	function updateQuiz(selectedQuizzes) {
		fetch(`/api/room/${router.query.roomId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ quizzes: selectedQuizzes }),
		})
			.then((response) => response.json())
			.then((jsonData) => {
				console.log(jsonData);
			});
	}

	useEffect(() => {
		fetchData();
	}, [limit]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
	};

	const handleQuizClick = (quizId) => {
		setSelectedQuizzes((prevSelectedQuizzes) => {
			const updatedQuizzes = prevSelectedQuizzes.includes(quizId) ? prevSelectedQuizzes.filter((id) => id !== quizId) : [...prevSelectedQuizzes, quizId];

			updateQuiz(updatedQuizzes);
			return updatedQuizzes;
		});
	};

	const filteredQuizzes = quizzes.filter((quiz) => quiz.title.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className="relative overflow-x-auto mt-2 w-full">
			<div className="relative w-full mb-8 mt-2">
				<input type="text" value={search} onChange={handleSearchChange} className="w-full px-4 py-2 focus:border-blue-500 peer h-10 bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 border focus:border-2 text-sm rounded-[7px] border-blue-gray-200" placeholder="Search quizzes..." style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }} />
			</div>

			{!isLoading ? (
				<div className="flex flex-col w-full space-y-5 overflow-x-auto h-[70vh]">
					{selectedQuizzes.length > 0 && (
						<>
							{selectedQuizzes
								.map((id) => quizzes.find((quiz) => quiz.id === id))
								.map((quiz) => (
									<div key={quiz.id} className={`cursor-pointer w-full text-sm border border-gray-600 bg-white shadow-sm rounded-lg pl-5 pr-4 py-3 flex items-center justify-between focus:outline-none transform transition-transform duration-300`} onClick={() => handleQuizClick(quiz.id)}>
										<div className="flex items-center">
											<span className="font-medium text-gray-700">{quiz.title}</span>
										</div>
									</div>
								))}
						</>
					)}
					{filteredQuizzes.length > 0 && (
						<>
							{filteredQuizzes
								.filter((quiz) => !selectedQuizzes.includes(quiz.id))
								.map((quiz) => (
									<div key={quiz.id} className={`cursor-pointer w-full text-sm border border-gray-200 bg-white shadow-sm rounded-lg pl-5 pr-4 py-3 flex items-center justify-between focus:outline-none`} onClick={() => handleQuizClick(quiz.id)}>
										<div className="flex items-center">
											<span className="font-medium text-gray-700">{quiz.title}</span>
										</div>
									</div>
								))}
						</>
					)}
				</div>
			) : (
				<div className="flex justify-center items-center w-full h-[70vh]"></div>
			)}
		</div>
	);
}

export default function Rooms() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [room, setRoom] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState('results');
	const [url, setUrl] = useState('');

	const pages = ['results', 'quizzes', 'stats'];

	useEffect(() => {
		if (window && router && room.room) {
			setUrl(window.location.href.replace(router.asPath, '') + '/r/' + room.room.link.slug);
		}
	}, [router, room]);

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
	}, [router.query.roomId, currentPage]);

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
						<a target="_blank" href={url}>
							{url}
						</a>

						<button onClick={() => navigator.clipboard.writeText(url)} className="bg-sky-500 text-white px-4 py-2 rounded-lg mt-4">
							COPY
						</button>
						<button onClick={() => router.push('/room/' + room.room.id + '/qr')} className="bg-sky-500 text-white px-4 py-2 rounded-lg mt-4">
							Open QR
						</button>

						<div className="border-b border-gray-200 w-full">
							<nav className="-mb-px flex gap-6 w-full" aria-label="Tabs">
								{pages.map((page, index) => (
									<a onClick={() => setCurrentPage(page)} key={'page-' + index} className={'cursor-pointer shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ' + (currentPage == page ? 'border-sky-500 px-1 pb-4 text-sm font-medium text-sky-600' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700 border-transparent')}>
										{page.substring(0, 1).toUpperCase() + page.substring(1)}
									</a>
								))}
							</nav>
						</div>

						{(() => {
							switch (currentPage) {
								case 'results':
									return <Answers results={room?.results} />;
								case 'quizzes':
									return <Quizzes oldQuizzes={room?.quizzes} />;
								case 'stats':
									return <Stats stats={room?.stats} />;
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
