import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Menu from '@/components/menu';
import ResultsList from '@/components/results';
import Confetti from '@/components/confetti';

function shuffle(array) {
	let currentIndex = array.length;

	while (currentIndex != 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}

const AnswersBox = ({ answers, setAnswers, question }) => {
	const color = 'bg-[#FFC50F]';
	// const color = 'bg-sky-500 bg-opacity-30';

	switch (question.type) {
		case 'textfield':
			return (
				<div className="relative mt-2 rounded-md shadow-sm">
					<input value={answers.join(', ')} onChange={(event) => setAnswers([event.target.value])} type="text" name="price" id="price" className="block w-full py-4 rounded-md border-0 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Answers" />
				</div>
			);
		case 'checkboxes':
			return (
				<div className={'flex gap-3 ' + (question.answers.length > 4 ? 'flex-wrap justify-between' : 'flex-col')} role="none">
					{question.answers.map((answer, index) => (
						<div
							key={index}
							onClick={() => {
								if (answers.includes(answer)) {
									setAnswers(answers.filter((selectedAnswer) => selectedAnswer !== answer));
								} else {
									setAnswers([...answers, answer]);
								}
							}}
							className={'border border-gray-200 rounded-md shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer ' + (answers.includes(answer) ? color : '') + (question.answers.length > 4 ? ' sm:w-[49%] w-[48%]' : ' w-full')}>
							<span className="flex items-center">
								<span className="text-sm leading-tight md:text-base md:leading-normal flex">
									<span className="text-gray-900 font-medium" id="headlessui-label-2">
										{answer}
									</span>
								</span>
							</span>

							<span className="border-transparent border-2 rounded-lg absolute inset-0 pointer-events-none" aria-hidden="true"></span>
						</div>
					))}
				</div>
			);
		case 'radios':
			return (
				<div className={'flex gap-3 ' + (question.answers.length > 4 ? 'flex-wrap justify-between' : 'flex-col')} role="none">
					{question.answers.map((answer, index) => (
						<div
							key={index}
							onClick={() => {
								setAnswers([answer]);
							}}
							className={'border border-gray-200 rounded-md shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer ' + (answers.includes(answer) ? color : '') + (question.answers.length > 4 ? ' sm:w-[49%] w-[48%]' : ' w-full')}>
							<span className="flex items-center">
								<span className="text-sm leading-tight md:text-base md:leading-normal flex">
									<span className="text-gray-900 font-medium" id="headlessui-label-2">
										{answer}
									</span>
								</span>
							</span>

							<span className="border-transparent border-2 rounded-lg absolute inset-0 pointer-events-none" aria-hidden="true"></span>
						</div>
					))}
				</div>
			);
		case 'boolean':
			return (
				<div className="flex flex-row gap-3" role="none">
					{question.answers.map((answer, index) => (
						<div
							onClick={() => {
								setAnswers([answer]);
							}}
							key={index}
							className={'border w-1/2 border-gray-200 rounded-md shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer ' + (answers.includes(answer) ? color : '')}>
							<span className="flex items-center">
								<span className="text-sm leading-tight md:text-base md:leading-normal flex">
									<span className="text-gray-900 font-medium" id="headlessui-label-2">
										{answer}
									</span>
								</span>
							</span>

							<span className="border-transparent border-2 rounded-lg absolute inset-0 pointer-events-none" aria-hidden="true"></span>
						</div>
					))}
				</div>
			);
		default:
			return <></>;
	}
};

const ResultsPage = ({ resultId }) => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [result, setResult] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [audioPolicy, setAudioPolicy] = useState(false);
	const [showButton, setShowButton] = useState(false);
	const [isContentLoading, setIsContentLoading] = useState(true);
	const audioRef = useRef();

	useEffect(() => {
		if (navigator.mediaCapabilities) {
			navigator.mediaCapabilities
				.decodingInfo({
					type: 'file',
					audio: { contentType: 'audio/mp3' },
				})
				.then((policy) => {
					if (policy && policy.supported && navigator.getAutoplayPolicy('mediaelement') === 'allowed') {
						setAudioPolicy(true);
					} else {
						setShowButton(true);
					}
				})
				.catch(() => {
					setShowButton(true);
				});
		} else {
			setShowButton(true);
		}
	}, []);

	useEffect(() => {
		if (resultId) {
			fetch(`/api/result/${resultId}`)
				.then((response) => response.json())
				.then((data) => {
					if (data.error !== 'Not Found') {
						setResult(data);
					}
				});
		}
	}, [resultId]);

	function showResults() {
		setAudioPolicy(true);
		if (audioRef.current) {
			audioRef.current.play();
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 2035);
	}

	const results = result && result.quiz?.info?.points === result.points;

	useEffect(() => {
		if (results == null) {
			return;
		}

		if (results == true) {
			showResults();
		} else {
			setIsLoading(false);
		}
	}, [results]);

	if (!resultId && !result) {
		return (
			<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto justify-center md:px-6 lg:px-8 h-[100vh]">
				<p className="mt-4 text-center">Invalid result</p>
			</div>
		);
	}

	return (
		<>
			<audio ref={audioRef} src="/tadaa.mp3" />
			<div className="flex mt-20 md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-4 mx-auto items-center justify-between md:flex-row md:px-6 lg:px-8">
				{!audioPolicy && showButton && (
					<div className="w-full h-[calc(100vh-130px)] flex items-center justify-center">
						<button onClick={showResults}>Show Results</button>
					</div>
				)}
				{isLoading && (
					<div className="w-full h-[calc(100vh-150px)] flex items-center justify-center">
						<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
					</div>
				)}
				{!isLoading && results && <Confetti />}
				{!isLoading && result && <ResultsList resultId={resultId} setIsLoading={setIsContentLoading} isLoading={isContentLoading || isLoading} />}
			</div>
		</>
	);
};

const Starter = ({ starter, setStarter }) => {
	const [error, setError] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	const handleStartClick = () => {
		const newError = {};
		let hasError = false;

		starter.fields.forEach((field) => {
			if (!field.value) {
				newError[field.type] = 'Field is required';
				hasError = true;
			} else if (field.type === 'email' && !validateEmail(field.value)) {
				newError[field.type] = 'Must be a valid email';
				hasError = true;
			}
		});

		setError(newError);

		if (!hasError) {
			setIsLoading(true);
			setTimeout(() => {
				router.push('/quiz/' + router.query.slug + '/1');
			}, 1000);
		}
	};

	const handleChange = (fieldType, value) => {
		const newStarter = { ...starter };
		newStarter.fields = newStarter.fields.map((field) => {
			if (field.type === fieldType) {
				return { ...field, value };
			}
			return field;
		});
		setStarter(newStarter);
	};

	const isFormValid = () => {
		return starter.fields.every((field) => field.value);
	};

	return (
		<div className="flex sm:items-center justify-center w-full h-full sm:px-5 md:px-24 gap-5">
			<div className="relative w-full p-5 pt-6 mt-2 min-h-[30rem] h-fit bg-white md:bg-card-texture bg-no-repeat bg-top md:rounded-2xl md:shadow-xl">
				<div>
					<h3 className="sm:text-3xl text-2xl font-bold text-gray-900">{starter.title}</h3>
					<p className="text-gray-500 sm:text-base text-sm">{starter.subtitle}</p>
					{starter.fields.map((field, index) => (
						<div key={index} className="mt-4">
							<h3 className="sm:text-xl text-xl">{field.text}</h3>
							<div className="relative w-full min-w-[200px] h-18 mt-2">
								<input type="text" placeholder={field.text} value={field.value || ''} onChange={(event) => handleChange(field.type, event.target.value)} className={`peer w-full h-10 bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 ${error[field.type] ? 'focus:border-red-500 border-red-500' : 'focus:border-blue-500'}`} />
								<label className={`flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content-[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content-[''] after:block after:flex-grow after:box-border after:h-1.5 after:mt-[6.5px] peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 ${error[field.type] ? 'peer-focus:text-red-500 before:border-red-gray-200 peer-focus:before:!border-red-500 after:border-red-gray-200 peer-focus:after:!border-red-500' : 'peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:!border-blue-500 after:border-blue-gray-200 peer-focus:after:!border-blue-500'}`}></label>
								{error[field.type] && (
									<p className="flex items-center gap-1 mt-1 font-sans text-sm antialiased font-normal leading-normal text-red-500">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4468" className="w-4 h-4 -mt-px">
											<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"></path>
										</svg>
										{error[field.type]}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center w-full justify-center flex-col mt-16 gap-4">
					<div className="flex items-center w-full justify-center">
						<div className="flex w-full justify-center">
							<button className="text-white w-full sm:max-w-96 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-5 bg-sky-500 hover:bg-sky-600 focus:outline-none disabled:bg-gray-400" disabled={!isFormValid() || isLoading} onClick={handleStartClick}>
								{isLoading ? 'Loading...' : 'Start'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Question() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [quiz, setQuiz] = useState({});
	const [question, setQuestion] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [answers, setAnswers] = useState([]);
	const [globalAnswers, setGlobalAnswers] = useState({});
	const [flags, setflags] = useState();
	const [history, setHistory] = useState([router.asPath]);
	const [room, setRoom] = useState({});
	const [starter, setStarter] = useState({});
	const [resultId, setResultId] = useState();
	const [title, setTitle] = useState('Quiz - Quizzoto');

	function getQuiz() {
		if (!router.query.slug || status === 'loading') {
			return;
		}

		fetch(`/api/quiz/` + router.query.slug)
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData != '404') {
					setQuiz(jsonData.quiz);
					let starter = {};
					starter.fields =
						jsonData?.quiz?.starter?.fields?.map((field) => {
							let value = '';
							switch (field.type) {
								case 'email':
									value = session?.user?.email || '';
									break;
								case 'name':
									value = session?.user?.name || '';
									break;
								default:
									value = '';
							}
							return { ...field, value };
						}) || [];

					starter.title = jsonData?.quiz?.starter?.title || '';
					starter.subtitle = jsonData?.quiz?.starter?.subtitle || '';

					setStarter(starter);
					setTitle(jsonData.quiz.title + ' - Quizzoto');
					getQuestion();
				} else {
					setQuiz('404');
					setIsLoading(false);
				}
			});
	}

	function getQuestion() {
		if (!router.query.questionId || router.query.questionId < 1) {
			return;
		}

		fetch(`/api/quiz/` + router.query.slug + '/' + router.query.questionId)
			.then((response) => response.json())
			.then((jsonData) => {
				if (router.query.questionId - 1 == quiz?.info?.length) {
					setQuestion('end');
				} else {
					if (jsonData != '404') {
						if (jsonData.shuffle && quiz.shuffle) {
							shuffle(jsonData.answers);
						}
						setQuestion(jsonData);
					} else {
						setQuestion('404');
					}
				}

				if (router.query.questionId == 'start') {
					setTimeout(() => {
						setIsLoading(false);
					}, 1000);
				} else {
					setIsLoading(false);
				}
			});
	}

	function submit() {
		let id = '';
		setGlobalAnswers((prevGlobalAnswers) => ({
			...prevGlobalAnswers,
			[parseInt(history.length > 1 ? history[history.length - 1] : '1') - 1]: answers,
		}));

		if (localStorage.getItem('room')) {
			id = JSON.parse(localStorage.getItem('room')).id;
			localStorage.removeItem('room');
		}

		fetch('/api/result', { method: 'POST', body: JSON.stringify({ slug: quiz.slug, answers: globalAnswers, roomId: id ? id : '', starter: starter ? starter : {} }) })
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData.id) {
					setResultId(jsonData.id);
					router.push('/quiz/' + router.query.slug + '/result');
				}
			});
	}

	useEffect(() => getQuiz(), [router.query.slug, status]);
	useEffect(() => {
		if (!router.query.questionId || router.query.questionId < 1) {
			return;
		}
		setGlobalAnswers((prevGlobalAnswers) => ({
			...prevGlobalAnswers,
			[parseInt(history.length > 1 ? history[history.length - 1] : '1') - 1]: answers,
		}));
		getQuestion();
		if (globalAnswers[router.query.questionId - 1]) {
			setAnswers(globalAnswers[router.query.questionId - 1]);
		} else {
			setAnswers([]);
		}
	}, [router.query.questionId]);

	useEffect(() => {
		const handleRouteChange = (url) => {
			setHistory((history) => [...history, url.split('/')[3]]);
		};

		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setRoom(JSON.parse(localStorage.getItem('room')));
		}
	}, []);

	return (
		<>
			<Head>
				<title>{title}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				{isLoading ? (
					<div className="h-[calc(100vh-140px)] max-w-6xl mt-[5rem] sm:mt-24 pb-5 mx-auto md:px-6 lg:px-8 bg-white md:bg-[#fcfcfc]">
						<Menu title={quiz.title} />
						<div className="flex sm:items-center justify-center w-full h-full sm:px-5 md:px-24 gap-5">
							<div className="flex mt-2 items-center justify-center relative w-full p-5 bg-white h-[30rem] md:bg-card-texture bg-no-repeat bg-top md:rounded-2xl md:shadow-xl">
								<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
								</svg>
							</div>
						</div>
						{room && <div className="w-full text-center b-0">In room : {room?.title}</div>}
					</div>
				) : quiz === '404' ? (
					<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto justify-center md:px-6 lg:px-8 h-[100vh]">
						<p className="mt-4 text-center">Quiz not Found</p>
					</div>
				) : router.query.questionId == 'result' ? (
					<ResultsPage resultId={resultId} />
				) : router.query.questionId == 'start' && !isLoading ? (
					<div className="h-[calc(100vh-140px)] max-w-6xl mt-[5rem] sm:mt-24 pb-5 mx-auto md:px-6 lg:px-8 bg-white md:bg-[#fcfcfc]">
						<Menu title={quiz.title} />
						{quiz?.starter && <Starter starter={starter} setStarter={setStarter} />}
						{room && <div className="w-full text-center b-0">In room : {room?.title}</div>}
					</div>
				) : question === '404' ? (
					<div className="h-[calc(100vh-140px)] max-w-6xl mt-[5rem] sm:mt-24 pb-5 mx-auto md:px-6 lg:px-8 bg-white md:bg-[#fcfcfc]">
						<Menu title={quiz.title} />
						<div className="flex items-center justify-center w-full h-full sm:px-5 md:px-24 gap-5">
							<div className="relative w-full flex justify-center items-center p-5 bg-white h-[30rem] md:bg-card-texture bg-no-repeat bg-top md:rounded-2xl md:shadow-xl">
								<p className="mt-4">Question not Found</p>
							</div>
						</div>
						{room && <div className="w-full text-center absolute b-0">In room : {room?.title}</div>}
					</div>
				) : (
					<div className="h-[calc(100vh-140px)] max-w-6xl mt-[5rem] sm:mt-24 pb-5 mx-auto md:px-6 lg:px-8 bg-white md:bg-[#fcfcfc]">
						<Menu title={quiz.title} />
						<div className="flex sm:items-center justify-center w-full h-full sm:px-5 md:px-24 gap-5">
							<div className="relative w-full flex flex-col justify-between p-5 bg-white mt-2 min-h-[30rem] h-fit md:bg-card-texture bg-no-repeat bg-top md:rounded-2xl md:shadow-xl">
								{question != 'end' ? (
									<div>
										<h3 className="sm:text-3xl text-xl font-bold mb-8">{question.question}</h3>
										<AnswersBox answers={answers} setAnswers={setAnswers} question={question} />
									</div>
								) : (
									<div className="flex items-center justify-center flex-col min-h-[25rem] gap-4">
										<p className="text-center">Are you sure you want to submit your answers ?</p>
										<div className="flex w-full justify-center">
											<button className="text-white w-full sm:max-w-96 bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-5 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none" onClick={() => submit()}>
												submit
											</button>
										</div>
									</div>
								)}
								<div className="flex justify-between items-center mb-0 h-6">
									<button
										className={'w-28 h-10 text-center text-white font-medium rounded-lg text-sm ' + (router.query.questionId > 1 ? 'bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none' : 'bg-white cursor-default')}
										onClick={() => {
											if (router.query.questionId > 1) {
												router.push('/quiz/' + router.query.slug + '/' + (parseInt(router.query.questionId) - 1));
											}
										}}>
										{router.query.questionId > 1 && '← Previous'}
									</button>
									{question != 'end' && <span className="text-sm font-medium text-gray-700">{(router.query.questionId >= quiz?.info?.length ? quiz.info.length : router.query.questionId) + '/' + (quiz.info ? quiz.info.length : '0')}</span>}
									{question != 'end' && (
										<button className="w-28 h-10 text-center text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none font-medium rounded-lg text-sm" onClick={() => router.push('/quiz/' + router.query.slug + '/' + (parseInt(router.query.questionId) + 1))}>
											Next →
										</button>
									)}
								</div>
							</div>
						</div>
						{room && <div className="w-full text-center">In room : {room?.title}</div>}
					</div>
				)}
			</main>
		</>
	);
}
