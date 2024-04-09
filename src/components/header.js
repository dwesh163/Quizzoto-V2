import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Header() {
	const [navbarOpen, setNavbarOpen] = useState(false);
	const { data: session, status } = useSession();
	const router = useRouter();

	return (
		<div className="absolute top-0 w-full z-30 bg-sky-600 bg-opacity-90 md:bg-opacity-90 transition duration-300 ease-in-out">
			<div className="flex flex-col max-w-6xl px-2 mx-auto items-center justify-between md:flex-row md:px-6 lg:px-8">
				<div className="flex items-center justify-between p-4 md:w-fit w-full">
					<a href="/" className="text-lg font-semibold rounded-lg tracking-widest focus:outline-none focus:shadow-outline">
						<h1 className="text-2xl tracking-tighter text-white md:text-3xl lg:text-4xl mt-0 md:mb-[4px]">QUIZZOTO</h1>
					</a>
					<button className="text-white cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none" type="button" aria-label="button" onClick={() => setNavbarOpen(!navbarOpen)}>
						{navbarOpen ? (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512">
								<path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
							</svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
								<line x1="3" y1="12" x2="21" y2="12"></line>
								<line x1="3" y1="6" x2="21" y2="6"></line>
								<line x1="3" y1="18" x2="21" y2="18"></line>
							</svg>
						)}
					</button>
				</div>

				<div className={'md:flex flex-grow items-center md:w-fit w-full ' + (navbarOpen ? ' flex' : ' hidden')}>
					<nav className={'flex flex-col w-full'}>
						<ul className="md:flex flex-grow justify-end flex-wrap items-center">
							<li>
								<a href="/" className="font-medium text-white hover:text-zinc-300 px-5 py-3 flex items-center transition duration-150 ease-in-out">
									Quizzes
								</a>
							</li>
							<li>
								<a href="/user" className="font-medium text-white hover:text-zinc-300 px-5 py-3 flex items-center transition duration-150 ease-in-out">
									Users
								</a>
							</li>
							<li className="mb-[1rem] md:mb-0">
								{session ? (
									<button onClick={() => router.push('/user/' + session.user.username)} className="font-medium text-white hover:text-zinc-300 px-5 py-3 flex items-center transition duration-150 ease-in-out">
										{session.user.name}
									</button>
								) : (
									<button className="px-4 py-2 mt-2 font-semibold bg-white text-gray-500 transition duration-300 ease-in-out transform rounded-lg md:mt-0 ml-4 hover:text-gray-400 focus:text-gray-400 focus:bg-gray-200 focus:outline-none focus:shadow-outline" onClick={() => signIn()}>
										Login
									</button>
								)}
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
}
