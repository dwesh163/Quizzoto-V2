import Head from 'next/head';
import Header from '@/components/header';

export default function Home() {
	return (
		<>
			<Head>
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
			</main>
		</>
	);
}
