import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQRCode } from 'next-qrcode';

export default function QR() {
	const [room, setRoom] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState('results');
	const [url, setUrl] = useState('');

	const router = useRouter();
	const { Canvas } = useQRCode();

	useEffect(() => {
		if (window && router && room) {
			setUrl(window.location.href.replace(router.asPath, '') + '/r/' + room.link.slug);
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
					setRoom(jsonData.room);

					setIsLoading(false);
				} else {
					setRoom('404');
				}
			});
	}, [router.query.roomId, currentPage]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfc]">
			<div className="sm:w-full p-8">
				<h1 className="font-bold rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center mb-6 tracking-tighter text-sky-600 text-9xl">QUIZZOTO</h1>
				{!isLoading && (
					<div className="flex flex-col items-center justify-center">
						<p className="text-3xl text-center">
							Join the room <strong>{room.title}</strong>
						</p>
						{url != '' && (
							<Canvas
								text={url}
								options={{
									errorCorrectionLevel: 'M',
									margin: 3,
									scale: 4,
									width: 200,
									color: {
										dark: '#0284c7',
										light: '#fff',
									},
								}}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
