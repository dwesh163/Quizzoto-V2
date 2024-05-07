import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getRedirectUrl } from '../../../lib/links';

export default function Link({ url, room }) {
	const router = useRouter();

	useEffect(() => {
		if (url && router && localStorage) {
			router.push(url);
			localStorage.setItem('room', JSON.stringify(room));
		}
	}, [url, router]);
	return <></>;
}

export async function getServerSideProps(context) {
	const { slug } = context.params;

	const { url, room } = await getRedirectUrl(slug);

	return {
		props: {
			url,
			room,
		},
	};
}
