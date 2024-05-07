import Head from 'next/head';
import Header from '@/components/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Menu from '@/components/menu';

const AnswersBox = ({ answers, setAnswers, question }) => {
	const color = 'bg-[#FFC50F]';
	// const color = 'bg-sky-500 bg-opacity-30';

	switch (question.type) {
		case 'textfield':
			return (
				<div className="relative mt-2 rounded-md shadow-sm">
					<input value={answers.join(', ')} onChange={(event) => setAnswers([event.target.value])} type="text" name="price" id="price" className="block w-full py-4 rounded-md border-0  pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Answers" />
				</div>
			);
		case 'checkboxes':
			return (
				<div className="flex flex-col gap-3" role="none">
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
							className={'border border-gray-200 rounded-md shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer ' + (answers.includes(answer) ? color : '')}>
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
				<div className="flex flex-col gap-3" role="none">
					{question.answers.map((answer, index) => (
						<div
							key={index}
							onClick={() => {
								setAnswers([answer]);
							}}
							className={'border border-gray-200 rounded-md shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer ' + (answers.includes(answer) ? color : '')}>
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
			const choices = ['true', 'false'];
			return (
				<div className="flex flex-row gap-3" role="none">
					{choices.map((choice, index) => (
						<div
							onClick={() => {
								setAnswers([choice]);
							}}
							key={index}
							className={'border w-1/2 border-gray-200 rounded-md shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer ' + (answers.includes(choice) ? color : '')}>
							<span className="flex items-center">
								<span className="text-sm leading-tight md:text-base md:leading-normal flex">
									<span className="text-gray-900 font-medium" id="headlessui-label-2">
										{choice.toUpperCase()}
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

	function getQuiz() {
		if (!router.query.slug) {
			return;
		}

		fetch(`/api/quiz/` + router.query.slug)
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData != '404') {
					setQuiz(jsonData);
					getQuestion();
				} else {
					setQuiz('404');
					setIsLoading(false);
				}
			});
	}

	function getQuestion() {
		if (!router.query.questionId) {
			return;
		}

		fetch(`/api/quiz/` + router.query.slug + '/' + router.query.questionId)
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData != '404') {
					setQuestion(jsonData);
				} else {
					setQuestion('404');
				}
				setIsLoading(false);
			});
	}

	function summit() {
		setGlobalAnswers((prevGlobalAnswers) => ({
			...prevGlobalAnswers,
			[parseInt(history.length > 1 ? history[history.length - 1] : '1') - 1]: answers,
		}));

		const { id } = JSON.parse(localStorage.getItem('room'));

		fetch('/api/result', { method: 'POST', body: JSON.stringify({ slug: quiz.slug, answers: globalAnswers, roomId: id }) })
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData.id) {
					router.push('/result/' + jsonData.id);
				}
			});
	}

	useEffect(() => getQuiz(), [router.query.slug]);
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
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				{isLoading ? (
					<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 h-[100vh]">
						<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
					</div>
				) : quiz === '404' ? (
					<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 h-[100vh]">
						<p className="mt-4">Quiz not Found</p>
					</div>
				) : question === '404' ? (
					<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 h-[100vh]">
						<p className="mt-4">Question not Found</p>
					</div>
				) : (
					<div className="h-[calc(100vh-150px)] max-w-6xl mt-24 pb-5 mx-auto md:px-6 lg:px-8 bg-white md:bg-[#fcfcfc]">
						<Menu title={quiz.title} />
						<div className="flex items-center justify-center w-full h-full sm:px-5 md:px-24">
							<div className="relative w-full p-5 bg-white md:bg-card-texture bg-no-repeat bg-top md:rounded-2xl md:shadow-xl ">
								<div className="flex justify-between">
									<button onClick={() => router.push('/quiz/' + router.query.slug + '/' + (parseInt(router.query.questionId) - 1))}>before</button>
									<span className="text-sm font-medium text-gray-700">{router.query.questionId + '/' + (quiz.info ? quiz.info.length : '0')}</span>
									<button onClick={() => router.push('/quiz/' + router.query.slug + '/' + (parseInt(router.query.questionId) + 1))}>after</button>
								</div>

								{question.question}
								<AnswersBox answers={answers} setAnswers={setAnswers} question={question} />
								{quiz?.info?.length == router.query.questionId && <button onClick={() => summit()}>SUMMIT</button>}
							</div>
						</div>
						<div className="w-full text-center">In room : {room?.title}</div>
					</div>
				)}
			</main>
		</>
	);
}
