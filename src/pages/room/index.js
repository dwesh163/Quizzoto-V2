import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Menu from '@/components/menu';

export default function Results() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [room, setRoom] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch('/api/room/')
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData.error != 'Not Found' && jsonData.error != 'unauthorized') {
					setRoom(jsonData);
					setIsLoading(false);
				} else {
					setRoom('404');
				}
			});
	}, []);

	return (
		<>
			<Head>
				<title>Rooms - Quizzoto</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				{isLoading ? (
					<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 h-[100vh]">{room == '404' && <p className="mt-4">Rooms not Found</p>}</div>
				) : (
					<div className="flex flex-col mt-20 md:bg-[#fcfcfc] bg-white max-w-6xl px-2 mx-auto items-center justify-between md:flex-col md:px-6 lg:px-8">
						<div className="relative overflow-x-auto w-full">
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
									<tr>
										<th scope="col" className="px-6 py-3">
											Title
										</th>
										<th scope="col" className="px-6 py-3">
											Comment
										</th>
										<th scope="col" className="px-6 py-3">
											Answers number
										</th>
										<th scope="col" className="px-6 py-3">
											Creator
										</th>

										<th scope="col" className="px-6 py-3 sm:flex hidden">
											Time
										</th>
									</tr>
								</thead>
								<tbody>
									{room?.map((room, index) => (
										<tr key={index} className="cursor-pointer hover:bg-slate-100" onClick={() => router.push('/room/' + room.id)}>
											<th scope="row" className="px-6 py-4 font-medium text-gray-900">
												{room.title}
											</th>
											<td className="px-6 py-4">{room.comment}</td>
											<td className="px-6 py-4">{room.resultsCount}</td>
											<td className="px-6 py-4">{room.user.username}</td>
											<td className="px-6 py-4 sm:flex hidden">{new Date(room.time).toLocaleString('fr-FR')}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-8" onClick={() => router.push('/room/create')}>
							Create Room
						</button>
					</div>
				)}
			</main>
		</>
	);
}
