import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Signin() {
	const router = useRouter();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="sm:w-full sm:max-w-sm p-8">
				<h1 className="font-semibold rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center mb-6 tracking-tighter text-sky-600 text-5xl">QUIZZOTO</h1>
				<h2 className="text-center text-xl  text-gray-900 mb-8">Sign in to your account</h2>
				<div className="flex flex-col gap-4">
					<button className="flex items-center justify-center transition-100 gap-2.5 px-2 py-3 bg-[#24292e] hover:bg-[#2e343b] rounded-lg drop-shadow-md text-white" onClick={() => signIn('github', { callbackUrl: router.query.callbackUrl })}>
						<img src="/svg/github-white.svg" alt="GitHub" className="h-6 w-6" />
						<p>Sign in with GitHub</p>
					</button>

					<button className="flex items-center justify-center transition-100 gap-2.5 px-2 py-3 bg-white hover:bg-[#f9f9f9] rounded-lg drop-shadow-md">
						<img src="/svg/google.svg" alt="Google" className="h-6 w-6" />
						<p>Sign in with Google</p>
					</button>

					<button className="flex items-center justify-center transition-100 gap-2.5 px-2 py-3 bg-[#ff662a] hover:bg-[#ff723a] rounded-lg drop-shadow-md text-white">
						<img src="/svg/gitlab-white.svg" alt="gitlab" className="h-6 w-6" />
						<p>Sign in with Gitlabs</p>
					</button>

					<button className="flex items-center justify-center transition-100 gap-0.5 px-2 py-3 bg-[#1877f2] hover:bg-[#328bff] rounded-lg drop-shadow-md text-white">
						<img src="/svg/facebook-white.svg" alt="facebook" className="h-6 w-6" />
						<p>Sign in with Facebook</p>
					</button>
				</div>
			</div>
		</div>
	);
}
