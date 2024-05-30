import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { data } from 'autoprefixer';

export default function Link() {
	const router = useRouter();

	const [info, setInfo] = useState(null);

	useEffect(() => {
		if (!router.query.joinId) {
			return;
		}
		fetch(`/api/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ joinId: router.query.joinId }) })
			.then((res) => res.json())
			.then((data) => {
				setInfo(data);
				if (data.message == 'redirect') {
					router.push('/room/' + info.redirect);
				}
			});
	}, [router]);

	return (
		<>
			<Head>
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="QuizzotoV2" />
			</Head>
			<main className="flex items-center justify-center h-screen">
				<p>{info?.message}</p>
				<p>{info?.error}</p>
			</main>
		</>
	);
}
