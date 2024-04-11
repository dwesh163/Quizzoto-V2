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
									<>
										{status == 'loading' ? (
											<svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
												<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
											</svg>
										) : (
											<button className="px-4 py-2 mt-2 font-semibold bg-white text-gray-500 transition duration-300 ease-in-out transform rounded-lg md:mt-0 ml-4 hover:text-gray-400 focus:text-gray-400 focus:bg-gray-200 focus:outline-none focus:shadow-outline" onClick={() => signIn()}>
												Login
											</button>
										)}
									</>
								)}
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
}
