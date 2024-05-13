import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useReducer, useState } from 'react';

const DropZone = ({ data, dispatch }) => {
	const [dropzoneBorder, setDropzoneBorder] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState('');

	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDropzoneBorder('');

		dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDropzoneBorder('');

		dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDropzoneBorder('border-indigo-600');

		e.dataTransfer.dropEffect = 'copy';
		dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDropzoneBorder('');

		let files = [...e.dataTransfer.files];

		if (files && files.length > 0) {
			const existingFiles = data.fileList.map((f) => f.name);
			files = files.filter((f) => !existingFiles.includes(f.name));

			dispatch({ type: 'ADD_FILE_TO_LIST', files });
			dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
		}
	};

	const handleFileSelect = (e) => {
		let files = [...e.target.files];
		if (files && files.length > 0) {
			const existingFiles = data.fileList.map((f) => f.name);
			files = files.filter((f) => !existingFiles.includes(f.name));

			dispatch({ type: 'ADD_FILE_TO_LIST', files });
		}
	};

	const uploadFiles = async () => {
		let files = data.fileList;
		console.log(files);
		const formData = new FormData();
		files.forEach((file) => formData.append('files', file));
		setIsLoading(true);
		setStatus('');
		console.log(formData);
		const response = await fetch('/api/quiz/import', {
			method: 'POST',
			body: formData,
		});

		response
			.json()
			.then((data) => {
				dispatch({ type: 'CLEAR_FILE_LIST' });
				setStatus(data);
				setIsLoading(false);
				if (response.ok) {
					setTimeout(() => {
						setStatus('');
					}, 10000);
				}
			})
			.catch((error) => {
				console.error('Error parsing response:', error);
			});
	};

	return (
		<>
			{isLoading ? (
				<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 h-[100vh]">
					<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
					</svg>
					<p className="mt-4">Upload in progress</p>
				</div>
			) : (
				<>
					<div className={'md:w-4/5 md:h-1/5 lg:h-[30%] lg:w-3/5 w-4/5 h-1/4 flex md:mt-0 mt-[-50px] justify-center items-center relative border-2 border-gray-300 border-dashed rounded-lg p-6 ' + dropzoneBorder} onDragEnter={(e) => handleDragEnter(e)} onDragOver={(e) => handleDragOver(e)} onDragLeave={(e) => handleDragLeave(e)} onDrop={(e) => handleDrop(e)}>
						<input className="absolute inset-0 w-full h-full opacity-0 z-50" accept=".json" type="file" onChange={(e) => handleFileSelect(e)} />
						<div className="text-center">
							<svg className="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
								<path fillRule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM4.151 15.29a1.2 1.2 0 0 1-.111-.449h.764a.58.58 0 0 0 .255.384q.105.073.25.114.142.041.319.041.245 0 .413-.07a.56.56 0 0 0 .255-.193.5.5 0 0 0 .084-.29.39.39 0 0 0-.152-.326q-.152-.12-.463-.193l-.618-.143a1.7 1.7 0 0 1-.539-.214 1 1 0 0 1-.352-.367 1.1 1.1 0 0 1-.123-.524q0-.366.19-.639.192-.272.528-.422.337-.15.777-.149.456 0 .779.152.326.153.5.41.18.255.2.566h-.75a.56.56 0 0 0-.12-.258.6.6 0 0 0-.246-.181.9.9 0 0 0-.37-.068q-.324 0-.512.152a.47.47 0 0 0-.185.384q0 .18.144.3a1 1 0 0 0 .404.175l.621.143q.326.075.566.211a1 1 0 0 1 .375.358q.135.222.135.56 0 .37-.188.656a1.2 1.2 0 0 1-.539.439q-.351.158-.858.158-.381 0-.665-.09a1.4 1.4 0 0 1-.478-.252 1.1 1.1 0 0 1-.29-.375m-3.104-.033a1.3 1.3 0 0 1-.082-.466h.764a.6.6 0 0 0 .074.27.5.5 0 0 0 .454.246q.285 0 .422-.164.137-.165.137-.466v-2.745h.791v2.725q0 .66-.357 1.005-.355.345-.985.345a1.6 1.6 0 0 1-.568-.094 1.15 1.15 0 0 1-.407-.266 1.1 1.1 0 0 1-.243-.39m9.091-1.585v.522q0 .384-.117.641a.86.86 0 0 1-.322.387.9.9 0 0 1-.47.126.9.9 0 0 1-.47-.126.87.87 0 0 1-.32-.387 1.55 1.55 0 0 1-.117-.641v-.522q0-.386.117-.641a.87.87 0 0 1 .32-.387.87.87 0 0 1 .47-.129q.265 0 .47.129a.86.86 0 0 1 .322.387q.117.255.117.641m.803.519v-.513q0-.565-.205-.973a1.46 1.46 0 0 0-.59-.63q-.38-.22-.916-.22-.534 0-.92.22a1.44 1.44 0 0 0-.589.628q-.205.407-.205.975v.513q0 .562.205.973.205.407.589.626.386.217.92.217.536 0 .917-.217.384-.22.589-.626.204-.41.205-.973m1.29-.935v2.675h-.746v-3.999h.662l1.752 2.66h.032v-2.66h.75v4h-.656l-1.761-2.676z" />
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								<label htmlFor="file-upload" className="relative cursor-pointer">
									<span>Drag and drop</span>
									<span className="text-indigo-600"> or browse </span>
									<input id="file-upload" name="file-upload" type="file" accept=".json" className="sr-only" />
								</label>
							</h3>
							<p className="mt-1 text-xs text-gray-500">{data.fileList[0] ? data.fileList[0].name : 'JSON up to 10MB'}</p>
						</div>
					</div>
					{data.fileList.length > 0 && (
						<button onClick={uploadFiles} className="bg-indigo-600 hover:bg-blue-700 text-white font-bold py-2 px-4 absolute md:mt-[60vh] mt-[45vh] rounded">
							Upload
						</button>
					)}
					{status != '' && data.fileList.length == 0 && <p className="text-xs sm:text-base md:mt-[60vh] mt-[45vh] absolute">{status.message}</p>}
				</>
			)}
		</>
	);
};

export default function Import() {
	const { data: session, status } = useSession();

	const reducer = (state, action) => {
		switch (action.type) {
			case 'SET_IN_DROP_ZONE':
				return { ...state, inDropZone: action.inDropZone };
			case 'ADD_FILE_TO_LIST':
				return { ...state, fileList: state.fileList.concat(action.files) };
			case 'CLEAR_FILE_LIST':
				return { ...state, fileList: [] };
			default:
				return state;
		}
	};

	const [data, dispatch] = useReducer(reducer, {
		inDropZone: false,
		fileList: [],
	});

	return (
		<>
			<Head>
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center mt-16 h-[calc(100vh-80px)] md:px-6 lg:px-8 ">
					<DropZone data={data} dispatch={dispatch} />
				</div>
			</main>
		</>
	);
}
