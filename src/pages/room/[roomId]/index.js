import Head from 'next/head';
import Header from '@/components/header';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Donut from '@/components/charts/donut';
import Area from '@/components/charts/area';

function Settings({ parameters }) {
	const router = useRouter();

	const [title, setTitle] = useState(parameters.data.title);
	const [comment, setComment] = useState(parameters.data.comment);
	const [slug, setSlug] = useState(parameters.data.slug);
	const [instruction, setInstruction] = useState(parameters.data.instruction);
	const [error, setError] = useState('');

	const [ask, setAsk] = useState(parameters.share.ask);
	const [authorized, setAuthorized] = useState(parameters.share.authorized);
	const [url, setUrl] = useState('');

	useEffect(() => {
		if (window && router) {
			setUrl(window.location.href.replace(router.asPath, '') + '/j/' + parameters.data.joinId);
		}
	}, [router]);

	useEffect(() => {
		fetch('/api/room/' + router.query.roomId, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title, comment, slug, instruction, ask, authorized }),
		})
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData.id) {
					router.push('/result/' + jsonData.id);
				}
			});
	}, [title, comment, instruction, ask, authorized]);

	return (
		<div className="w-full">
			<div className="w-full flex mt-4 sm:flex-row flex-col justify-between mb-4">
				<div class="bg-white sm:w-[49%] w-full sm:rounded-lg sm:shadow p-4 md:p-6">
					<div class="flex justify-between mb-3">
						<div class="flex justify-center items-center">
							<h5 class="text-xl font-bold leading-none text-gray-900 pe-1">Room Info</h5>
						</div>
					</div>
					<div className="flex w-full gap-5 pt-3 sm:flex-row flex-col">
						<div className="relative w-full min-w-[200px] h-18">
							<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={'peer w-full h-10 bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 ' + (error && title.trim() === '' ? 'focus:border-red-500 border-red-500' : 'focus:border-blue-500')} placeholder=" " />
							<label className={"flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 " + (error && title.trim() === '' ? 'peer-focus:text-red-500 before:border-red-gray-200 peer-focus:before:!border-red-500 after:border-red-gray-200 peer-focus:after:!border-red-500' : 'peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500')}>Room Title</label>
							{error && title.trim() === '' && (
								<p className="flex items-center gap-1 mt-1 font-sans text-sm antialiased font-normal leading-normal text-red-500">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4468" className="w-4 h-4 -mt-px">
										<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"></path>
									</svg>
									Missing field
								</p>
							)}
						</div>

						<div className="relative w-full min-w-[200px] h-18">
							<input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={'peer w-full h-10 bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 ' + (error && (slug.trim() === '' || error != 'Missing fields') ? 'focus:border-red-500 border-red-500' : 'focus:border-blue-500')} placeholder=" " />
							<label className={"flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 " + (error && (slug.trim() === '' || error != 'Missing fields') ? 'peer-focus:text-red-500 before:border-red-gray-200 peer-focus:before:!border-red-500 after:border-red-gray-200 peer-focus:after:!border-red-500' : 'peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500')}>Room Slug</label>
							{slug.trim() === '' && error == 'Missing fields' && (
								<p className="flex items-center gap-1 mt-1 font-sans text-sm antialiased font-normal leading-normal text-red-500">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4468" className="w-4 h-4 -mt-px">
										<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"></path>
									</svg>
									Missing field
								</p>
							)}
							{error != 'Missing fields' && slug.trim() != '' && error && (
								<p className="flex items-center gap-1 mt-1 font-sans text-sm antialiased font-normal leading-normal text-red-500">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4468" className="w-4 h-4 -mt-px">
										<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"></path>
									</svg>
									{error}
								</p>
							)}
						</div>
					</div>

					<div className="relative w-full h-18 mt-3">
						<input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className={'peer w-full h-10 bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 ' + (error && comment.trim() === '' ? 'focus:border-red-500 border-red-500' : 'focus:border-blue-500')} placeholder=" " />
						<label className={"flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 " + (error && comment.trim() === '' ? 'peer-focus:text-red-500 before:border-red-gray-200 peer-focus:before:!border-red-500 after:border-red-gray-200 peer-focus:after:!border-red-500' : 'peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500')}>Room Comment</label>
						{error && comment.trim() === '' && (
							<p className="flex items-center gap-1 mt-1 font-sans text-sm antialiased font-normal leading-normal text-red-500">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4468" className="w-4 h-4 -mt-px">
									<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"></path>
								</svg>
								Missing field
							</p>
						)}
					</div>

					<div className="relative w-full min-w-[200px] h-18 mt-3">
						<textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} className={'peer w-full h-28 bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 ' + (error && instruction.trim() === '' ? 'focus:border-red-500 border-red-500' : 'focus:border-blue-500')} placeholder=" " maxLength={100} />
						<label className={"flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 " + (error && instruction.trim() === '' ? 'peer-focus:text-red-500 before:border-red-gray-200 peer-focus:before:!border-red-500 after:border-red-gray-200 peer-focus:after:!border-red-500' : 'peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500')}>Room instruction</label>
						<div className="flex justify-between">
							<div>
								{error && instruction.trim() === '' && (
									<p className="flex items-center gap-1 mt-1 font-sans text-sm antialiased font-normal leading-normal text-red-500">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4468" className="w-4 h-4 -mt-px">
											<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"></path>
										</svg>
										Missing field
									</p>
								)}
								{instruction.length > 100 && (
									<p className="flex items-center gap-1 mt-1 font-sans text-sm antialiased font-normal leading-normal text-red-500">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4468" className="w-4 h-4 -mt-px">
											<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"></path>
										</svg>
										Character limit reached
									</p>
								)}
							</div>
							<p className="text-gray-500">{instruction.length}/100</p>
						</div>
					</div>
				</div>

				<div class="bg-white sm:w-[49%] w-full sm:rounded-lg sm:shadow p-4 md:p-6">
					<div class="flex justify-between mb-3">
						<div class="flex justify-between w-full items-center">
							<h5 class="text-xl font-bold leading-none text-gray-900 pe-1">User</h5>
							<p
								className="cursor-pointer select-none text-blue-600 hover:underline"
								onClick={(e) => {
									const element = e.target;
									const originalText = element.innerText;

									navigator.clipboard
										.writeText(url)
										.then(() => {
											element.innerText = 'Copied';
											setTimeout(() => {
												element.innerText = originalText;
											}, 3000);
										})
										.catch((error) => {
											console.error('Failed to copy URL to clipboard:', error);
										});
								}}>
								Copy invitation link
							</p>
						</div>
					</div>
					<div>
						<div className={ask.length > 0 ? 'mb-4' : ''}>
							{ask.map((user, index) => (
								<div key={'ask-' + index} className="sm:px-0 sm:py-2 px-3 py-2 w-full justify-between select-none font-medium text-gray-900 flex gap-4 items-center leading-tight transition-all rounded-lg outline-none text-start">
									<div className="flex">
										<div className="grid mr-2 place-items-center">
											<img alt="" src={user.image ? user.image : 'https://upload.wikimedia.org/wikipedia/commons/divumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'} className="relative inline-block h-12 w-12 !rounded-full object-cover object-center" />
										</div>
										{user.name && user.email ? (
											<div>
												<h6 className="block font-sans sm:text-base text-sm antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900 truncate">{user.name}</h6>
												<p className="block font-sans sm:text-sm text-xs -mt-1.5 antialiased font-normal leading-normal text-gray-700 sm:w-48 w-12 truncate">{user.email}</p>
											</div>
										) : (
											<div>
												<h6 className="block font-sans sm:text-base text-sm antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900 truncate">Anonymous</h6>
											</div>
										)}
									</div>

									<div className="flex truncate">
										<button onClick={() => setAsk(ask.filter((a) => a.id !== user.id))} className="flex gap-1 bg-red-300 text-red-600 text-sm font-medium me-2 pl-1.5 px-2.5 py-0.5 rounded cursor-pointer truncate">
											<img src="/svg/wrong.svg" />
											Refuse
										</button>
										<button
											onClick={() => {
												setAsk(ask.filter((a) => a.id !== user.id));
												setAuthorized([...authorized, user]);
											}}
											className="flex gap-1 bg-green-300 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded cursor-pointer truncate">
											<img src="/svg/correct.svg" />
											Accept
										</button>
									</div>
								</div>
							))}
						</div>
						<div className="">
							{authorized.map((user, index) => (
								<div key={'authorized-' + index} className="sm:px-0 sm:py-2 px-3 py-2 w-full flex justify-between select-none font-medium text-gray-900 gap-4 items-center leading-tight transition-all rounded-lg outline-none text-start">
									<div className="flex">
										<div className="grid mr-2 place-items-center">
											<img alt="" src={user.image ? user.image : 'https://upload.wikimedia.org/wikipedia/commons/divumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'} className="relative inline-block h-12 w-12 !rounded-full object-cover object-center" />
										</div>
										{user.name && user.email ? (
											<div>
												<h6 className="block font-sans sm:text-base text-sm antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900 truncate">{user.name}</h6>
												<p className="block font-sans sm:text-sm text-xs -mt-1.5 antialiased font-normal leading-normal text-gray-700 sm:w-72 w-16 truncate">{user.email}</p>
											</div>
										) : (
											<div>
												<h6 className="block font-sans sm:text-base text-sm antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900 truncate">Anonymous</h6>
											</div>
										)}
									</div>

									{parameters.admin !== user.id && (
										<div className="flex truncate">
											<button onClick={() => setAuthorized(authorized.filter((a) => a.id !== user.id))} class="flex gap-1 bg-red-300 text-red-600 text-sm font-medium me-2 pl-1.5 px-2.5 py-0.5 rounded cursor-pointer truncate">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="mt-0.5" viewBox="0 0 16 16">
													<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
													<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
												</svg>
												Remove
											</button>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

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

		fetch(`/api/quiz/?limit=${limit}&search=${search}&order=${order}&roomId=${router.query.roomId}`)
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
			.then((jsonData) => {});
	}

	useEffect(() => {
		if (router.query.roomId) {
			fetchData();
		}
	}, [limit, router.query.roomId]);

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
				<div className="flex flex-col w-full space-y-5 overflow-x-auto h-[70vh] select-none">
					{selectedQuizzes.length > 0 && (
						<>
							{selectedQuizzes
								?.map((id) => quizzes.find((quiz) => quiz.id === id))
								?.map((quiz) => (
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
								?.filter((quiz) => !selectedQuizzes.includes(quiz.id))
								?.map((quiz) => (
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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [title, setTitle] = useState('Room - Quizzoto');

	const [pages, setPages] = useState(['results', 'quizzes', 'stats']);

	useEffect(() => {
		if (status === 'authenticated' && session && session.user && session.user.email === room?.room?.user?.email && !pages.includes('settings')) {
			setPages((prevPages) => [...prevPages, 'settings']);
		}
	}, [status, room]);

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
					setTitle(jsonData.room.title + ' - Quizzoto');
					setIsLoading(false);
				} else {
					setRoom('404');
				}
			});
	}, [router.query.roomId, currentPage]);

	async function deleteQuiz() {
		const response = await fetch(`/api/room/${router.query.roomId}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			router.push('/room');
		}
	}

	return (
		<>
			<Head>
				<title>{title}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				{isModalOpen && (
					<div class="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
						<div aria-hidden="true" class="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"></div>

						<div class="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
							<div class="w-full py-2 bg-white cursor-default pointer-events-auto relative rounded-xl mx-auto max-w-sm">
								<button tabindex="-1" type="button" class="absolute top-2 right-2 rtl:right-auto rtl:left-2" onClick={() => setIsModalOpen(false)}>
									<svg title="Close" tabindex="-1" class="h-4 w-4 cursor-pointer text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
									</svg>
									<span class="sr-only">Close</span>
								</button>

								<div class="space-y-2 p-2">
									<div class="p-4 space-y-2 text-center">
										<h2 class="text-xl font-bold tracking-tight" id="page-action.heading">
											Delete {room.room?.title}
										</h2>

										<p class="text-gray-500">Are you sure you would like to do this?</p>
									</div>
								</div>

								<div class="space-y-2">
									<div aria-hidden="true" class="border-t px-2"></div>

									<div class="px-6 py-2">
										<div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
											<button type="button" class="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600">
												<span class="flex items-center gap-1">
													<span class="" onClick={() => setIsModalOpen(false)}>
														Cancel
													</span>
												</span>
											</button>

											<button onClick={() => deleteQuiz()} type="submit" class="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:ring-offset-red-700">
												<span class="flex items-center gap-1">
													<span class="">Confirm</span>
												</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				{isLoading ? (
					<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 h-[100vh]">
						{room != '404' ? (
							<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
							</svg>
						) : (
							<>
								<p className="mt-4">Rooms not Found</p>
								{!session && (
									<span className="flex gap-1">
										Try to{' '}
										<p onClick={() => signIn()} className="cursor-pointer select-none text-blue-500 hover:underline">
											sign in
										</p>
									</span>
								)}
							</>
						)}
					</div>
				) : (
					<div className="flex mt-20 md:bg-[#fcfcfc] bg-white flex-col max-w-6xl mx-auto items-center justify-between md:px-6 px-4 lg:px-8">
						<div className="flex justify-between w-full mt-4 mb-7">
							<div>
								<h3 className="sm:text-3xl text-2xl font-bold text-gray-900">Room {room?.room?.title}</h3>
								<p className="text-gray-500 sm:text-base text-sm">{room?.room?.comment}</p>
							</div>

							<div className="flex items-center">
								<button
									className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg sm:text-sm text-xs sm:px-5 px-2 sm:py-2.5 py-2 me-2 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none flex items-center gap-1"
									onClick={(e) => {
										const element = e.target;
										const originalInnerHTML = element.innerHTML;

										navigator.clipboard
											.writeText(url)
											.then(() => {
												element.innerHTML = `
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
														<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
													</svg>
													<p className="sm:flex hidden text-sm">Copied</p>
												`;
												setTimeout(() => {
													element.innerHTML = originalInnerHTML;
												}, 3000);
											})
											.catch((error) => {
												console.error('Failed to copy URL to clipboard:', error);
											});
									}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
										<path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
									</svg>
									<p className="sm:flex hidden text-sm">Copy URL</p>
								</button>

								<button onClick={() => window.open(window.location.href + '/qr')} type="button" className="text-white w-fit bg-gray-400 hover:bg-gray-500 focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 sm:py-2.5 py-2 me-2 focus:outline-none flex items-center gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-qr-code" viewBox="0 0 16 16">
										<path d="M2 2h2v2H2z" />
										<path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z" />
										<path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z" />
										<path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z" />
										<path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z" />
									</svg>
									<p className="sm:flex hidden text-sm">Open QR</p>
								</button>
								<button onClick={() => window.open(url)} type="button" className="text-white w-fit bg-gray-400 hover:bg-gray-500 focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 sm:py-2.5 py-2 me-2 focus:outline-none flex items-center gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
										<path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
										<path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
									</svg>
									<p className="sm:flex hidden text-sm">See room</p>
								</button>
								<button
									onClick={(event) => {
										setIsModalOpen(true);
									}}
									type="button"
									className="text-white w-fit bg-red-500 hover:bg-red-600 focus:ring-1 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 sm:py-2.5 py-2 me-2 focus:outline-none flex items-center gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
										<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
									</svg>
									<p className="sm:flex hidden text-sm">Delete</p>
								</button>
							</div>

							{/* <div className="flex gap-2 items-center">
								<button
									className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg sm:text-sm text-xs sm:px-5 px-2 sm:py-2.5 py-2 me-2 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none"
									onClick={(e) => {
										const element = e.target;
										const originalText = element.innerText;

										navigator.clipboard
											.writeText(url)
											.then(() => {
												element.innerText = 'Copied';
												setTimeout(() => {
													element.innerText = originalText;
												}, 3000);
											})
											.catch((error) => {
												console.error('Failed to copy URL to clipboard:', error);
											});
									}}>
									Publish
								</button>

								<button
									onClick={(event) => {
										setIsModalOpen(true);
									}}
									type="button"
									className="text-white w-fit bg-red-500 hover:bg-red-600 focus:ring-1 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 sm:py-2.5 py-2 me-2 focus:outline-none flex items-center gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
										<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
									</svg>
									<p className="sm:flex hidden text-sm">Delete</p>
								</button>

								<a className="cursor-pointer select-none bg-sky-500 hover:opacity-90 text-white sm:text-base text-xs sm:px-4 sm:py-2 px-2 py-1 rounded-lg sm:h-10 h-6">Open QR</a>
							</div> */}
						</div>

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
								case 'settings':
									return <Settings parameters={room?.parameters} />;
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
