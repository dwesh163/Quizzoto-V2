import { useState, useEffect } from 'react';
import { getSession, useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/header';

export default function Page() {
	const { data: session, status } = useSession();

	const router = useRouter();

	const [quizzData, setQuizzData] = useState({});
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const boolean = ['true', 'false'];

	const saveData = async () => {
		let localData = JSON.parse(localStorage.getItem('quizzData'));
		if (localData === null) {
			localData = {};
		}

		const updatedQuestions = quizzData.questions.map((question) => {
			if (question.type == 'checkboxes') {
				const updatedQuestion = { ...question };

				let correct = [];

				updatedQuestion.correct.map((correctAnswer, index) => {});

				updatedQuestion.correct = correct;

				return updatedQuestion;
			} else {
				return question;
			}
		});

		localData[router.query.quizId] = quizzData;
		localData[router.query.quizId].update = new Date();
		localStorage.setItem('quizzData', JSON.stringify(localData));
	};

	const publishData = async () => {
		let newQuizzData = quizzData;

		const updatedQuestions = quizzData.questions.map((question) => {
			if (question.type == 'checkboxes') {
				const updatedQuestion = { ...question };

				let correct = [];

				updatedQuestion.correct.map((correctAnswer, index) => {
					if (correctAnswer != -1 && correctAnswer != null && correctAnswer != undefined) {
						correct.push(updatedQuestion.answers[correctAnswer]);
					}
				});

				updatedQuestion.correct = correct;

				return updatedQuestion;
			} else {
				return question;
			}
		});

		newQuizzData.questions = updatedQuestions;

		const response = await fetch(`/api/quiz/create/${router.query.quizId}`, {
			method: 'POST',
			body: JSON.stringify(newQuizzData),
		});
		const data = await response.json();
	};

	async function changeVisibility(visibility) {
		const response = await fetch(`/api/quiz/create/${router.query.quizId}`, {
			method: 'POST',
			body: JSON.stringify({ visibility: visibility }),
		});
		if (response.ok) {
			getData();
		}
	}

	async function deleteQuiz() {
		const response = await fetch(`/api/quiz/create/${router.query.quizId}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			router.push('/quiz');
		}
	}

	const getData = async () => {
		if (status === 'authenticated') {
			const response = await fetch(`/api/quiz/create/${router.query.quizId}`);
			let data = await response.json();
			if (data === 404) {
				setQuizzData({
					image: '',
					title: '',
					creator: session.user.id,
					visibility: 'hidden',
					tags: [],
					questions: [
						{
							credit: '',
							image: '',
							question: '',
							answers: [''],
							type: '',
							correct: [''],
							point: 2,
						},
					],
					quizzDescription: '',
					info: {
						length: '',
						points: '',
					},
					quizzSlug: '',
				});
			} else {
				if (JSON.parse(localStorage.getItem('quizzData')) != null && JSON.parse(localStorage.getItem('quizzData'))[router.query.quizId] != null) {
					if (data.update > JSON.parse(localStorage.getItem('quizzData'))[router.query.quizId].update) {
						const updatedQuestions = data.questions.map((question) => {
							if (question.type == 'checkboxes') {
								const updatedQuestion = { ...question };

								updatedQuestion.correct = updatedQuestion.correct.map((correctAnswer) => {
									return updatedQuestion.answers.indexOf(correctAnswer);
								});

								return updatedQuestion;
							} else {
								return question;
							}
						});

						data.questions = updatedQuestions;

						setQuizzData(data);
					} else {
						setQuizzData(JSON.parse(localStorage.getItem('quizzData'))[router.query.quizId]);
					}
				} else {
					const updatedQuestions = data.questions.map((question) => {
						if (question.type == 'checkboxes') {
							const updatedQuestion = { ...question };

							updatedQuestion.correct = updatedQuestion.correct.map((correctAnswer) => {
								return updatedQuestion.answers.indexOf(correctAnswer);
							});

							return updatedQuestion;
						} else {
							return question;
						}
					});

					data.questions = updatedQuestions;
					setQuizzData(data);
				}
			}
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, [status, session]);

	return (
		<>
			<Head>
				<title>Create - Quizzoto</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 mt-20">
					<div className="w-full mx-auto px-4 md:px-auto md:mt-6">
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
													Delete {quizzData.title}
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

						{!loading ? (
							<>
								<div className="flex justify-between items-center mb-5">
									<h3 className="sm:text-3xl text-2xl font-bold text-gray-700">Create Quizz</h3>
									<div className="flex items-center">
										<button
											className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg sm:text-sm text-xs sm:px-5 px-2 sm:py-2.5 py-2 me-2 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none"
											onClick={(event) => {
												publishData();
											}}>
											Publish
										</button>
										<button
											onClick={(event) => {
												saveData();
											}}
											type="button"
											className="text-white w-fit bg-gray-400 hover:bg-gray-500 focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 sm:py-2.5 py-2 me-2 focus:outline-none flex items-center gap-1">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy sm:w-6 w-4" viewBox="0 0 16 16">
												<path d="M11 2H9v3h2z" />
												<path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
											</svg>
											<p className="sm:flex hidden text-sm">Save</p>
										</button>
										<button
											onClick={(event) => {
												changeVisibility(quizzData.visibility == 'public' ? 'private' : 'public');
											}}
											type="button"
											className="text-white w-fit bg-gray-400 hover:bg-gray-500 focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 sm:py-2.5 py-2 me-2 focus:outline-none flex items-center gap-1">
											{quizzData.visibility == 'public' ? (
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
													<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
													<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
												</svg>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
													<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
													<path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
													<path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
												</svg>
											)}
											<p className="sm:flex hidden text-sm">{quizzData.visibility == 'public' ? 'Public' : 'Private'}</p>
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
								</div>
								<div className="mx-auto grid grid-cols-1 w-full lg:gap-x-20 lg:grid-cols-2">
									<div className="relative py-3 flex flex-col-reverse rounded-lg bg-none row-start-3">
										<input
											className="border border-gray-300 rounded-md p-2 mb-2"
											type="text"
											placeholder="Quizz slug"
											value={quizzData.slug}
											onChange={(event) => {
												setQuizzData((prevData) => ({
													...prevData,
													slug: event.target.value,
												}));
											}}
										/>
										<input
											className="border border-gray-300 rounded-md p-2 mb-2"
											type="text"
											placeholder="Quizz title"
											value={quizzData.title}
											onChange={(event) => {
												setQuizzData((prevData) => ({
													...prevData,
													title: event.target.value,
												}));
											}}
										/>
									</div>
									<div className="w-full grid gap-4 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-8 lg:mb-0">
										<div className="relative w-full h-60 sm:h-72 sm:col-span-4 lg:col-span-full">
											<div className="absolute rounded-lg w-full inset-0 overflow-hidden">
												<img src={quizzData.image} alt={quizzData.title} className="w-full h-full object-cover rounded-lg" loading="lazy" />
											</div>
										</div>
									</div>

									<div className="mt-4 text-xs font-medium flex items-center justify-between row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2"></div>
									<div className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-6 lg:row-start-4 lg:col-span-1">
										<textarea
											className="border border-gray-300 rounded-md p-2 mb-2 w-full"
											rows={4}
											placeholder="quizz description"
											value={quizzData.description}
											onChange={(event) => {
												setQuizzData((prevData) => ({
													...prevData,
													quizzDescription: event.target.value,
												}));
											}}
										/>
									</div>
								</div>

								<hr className="w-full h-1 my-8 bg-gray-200 border-0 rounded" />

								{quizzData.questions.map((question, index) => (
									<div key={index}>
										<div className="flex gap-4 mb-6 mt-4">
											<input
												className="border border-gray-300 rounded-md p-2 w-5/6"
												type="text"
												placeholder="Quizz title"
												value={question.question}
												onChange={(event) => {
													const newQuestions = [...quizzData.questions];
													newQuestions[index].question = event.target.value;
													setQuizzData((prevData) => ({
														...prevData,
														questions: newQuestions,
													}));
												}}
											/>
											<select
												className="border sm:w-40 w-16 border-gray-300 rounded p-2 appearance-none bg-white text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
												value={question.type}
												onChange={(event) => {
													const newQuestions = [...quizzData.questions];
													newQuestions[index].type = event.target.value;
													setQuizzData((prevData) => ({
														...prevData,
														questions: newQuestions,
													}));
												}}>
												<option value="">Select</option>
												<option value="textfield">Text Field</option>
												<option value="boolean">Boolean</option>
												<option value="radios">Radios</option>
												<option value="checkboxes">Checkboxes</option>
											</select>
										</div>
										{question.type === 'boolean' && (
											<div>
												{boolean.map((answer, answerIndex) => (
													<div key={answerIndex} className="flex gap-2">
														<input
															className="border border-gray-300 rounded-md p-2 mb-2 w-full"
															type="text"
															placeholder={`Answer ${answerIndex + 1}`}
															value={answer}
															onChange={(event) => {
																const newQuestions = [...quizzData.questions];
																newQuestions[index].answers[answerIndex] = event.target.value;
																setQuizzData((prevData) => ({
																	...prevData,
																	questions: newQuestions,
																}));
															}}
														/>
														{question.correct.includes(answer) ? (
															<button
																className="text-white focus:ring-1 focus:ring-green-300 font-medium rounded-lg text-sm mb-2 px-2.5 py-2 bg-green-500 hover:bg-green-600 focus:outline-none"
																onClick={(event) => {
																	const newQuestions = [...quizzData.questions];
																	newQuestions[index].correct.push(answer);
																	setQuizzData((prevData) => ({
																		...prevData,
																		questions: newQuestions,
																	}));
																}}>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check w-7 h-7" viewBox="0 0 16 16">
																	<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
																</svg>
															</button>
														) : (
															<button
																className="text-white focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm mb-2 px-2.5 py-2 bg-gray-400 hover:bg-gray-500 focus:outline-none"
																onClick={(event) => {
																	const newQuestions = [...quizzData.questions];
																	newQuestions[index].correct = [answer];
																	setQuizzData((prevData) => ({
																		...prevData,
																		questions: newQuestions,
																	}));
																}}>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check w-7 h-7" viewBox="0 0 16 16">
																	<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
																</svg>
															</button>
														)}
													</div>
												))}
											</div>
										)}
										{question.type === 'textfield' && (
											<input
												className="border border-gray-300 rounded-md p-2 mb-2 w-full"
												type="text"
												placeholder="Correct Answer"
												value={question.correct.join(', ')}
												onChange={(event) => {
													const newQuestions = [...quizzData.questions];
													newQuestions[index].correct = event.target.value.split(', ');
													newQuestions[index].answers = event.target.value.split(', ');
													setQuizzData((prevData) => ({
														...prevData,
														questions: newQuestions,
													}));
												}}
											/>
										)}
										{question.type === 'checkboxes' && (
											<div>
												{question.answers.map((answer, answerIndex) => (
													<div key={answerIndex} className="flex gap-2">
														<input
															className="border border-gray-300 rounded-md p-2 mb-2 w-full"
															type="text"
															placeholder={`Answer ${answerIndex + 1}`}
															value={answer}
															onChange={(event) => {
																const newQuestions = [...quizzData.questions];
																newQuestions[index].answers[answerIndex] = event.target.value;
																setQuizzData((prevData) => ({
																	...prevData,
																	questions: newQuestions,
																}));
															}}
														/>
														{question.correct.includes(answerIndex) ? (
															<button
																className="text-white focus:ring-1 focus:ring-green-300 font-medium rounded-lg text-sm mb-2 px-2.5 py-2 bg-green-500 hover:bg-green-600 focus:outline-none"
																onClick={(event) => {
																	const newQuestions = [...quizzData.questions];
																	const correctIndex = newQuestions[index].correct.indexOf(answerIndex);
																	if (correctIndex !== -1) {
																		newQuestions[index].correct.splice(correctIndex, 1);
																	}
																	setQuizzData((prevData) => ({
																		...prevData,
																		questions: newQuestions,
																	}));
																}}>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check w-7 h-7" viewBox="0 0 16 16">
																	<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
																</svg>
															</button>
														) : (
															<button
																className="text-white focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm mb-2 px-2.5 py-2 bg-gray-400 hover:bg-gray-500 focus:outline-none"
																onClick={(event) => {
																	const newQuestions = [...quizzData.questions];
																	newQuestions[index].correct.push(answerIndex);
																	setQuizzData((prevData) => ({
																		...prevData,
																		questions: newQuestions,
																	}));
																}}>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check w-7 h-7" viewBox="0 0 16 16">
																	<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
																</svg>
															</button>
														)}
														<button
															className="text-white focus:ring-1 focus:ring-red-300 font-medium rounded-lg text-sm mb-2 px-4 py-2 bg-red-500 hover:bg-red-600 focus:outline-none"
															onClick={(event) => {
																const newQuestions = [...quizzData.questions];
																newQuestions[index].answers.splice(answerIndex, 1);
																setQuizzData((prevData) => ({
																	...prevData,
																	questions: newQuestions,
																}));
															}}>
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
																<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
																<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
															</svg>
														</button>
													</div>
												))}
												{question.answers.length < 8 && (
													<button
														className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-5 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none"
														onClick={(event) => {
															const newQuestions = [...quizzData.questions];
															newQuestions[index].answers.push('');
															setQuizzData((prevData) => ({
																...prevData,
																questions: newQuestions,
															}));
														}}>
														+ Checkboxes
													</button>
												)}
											</div>
										)}

										{question.type === 'radios' && (
											<div>
												{question.answers.map((answer, answerIndex) => (
													<div key={answerIndex} className="flex gap-2">
														<input
															className="border border-gray-300 w-full rounded-md p-2 mb-2"
															type="text"
															placeholder={`Answer ${answerIndex + 1}`}
															value={answer}
															onChange={(event) => {
																const newQuestions = [...quizzData.questions];
																newQuestions[index].answers[answerIndex] = event.target.value;
																setQuizzData((prevData) => ({
																	...prevData,
																	questions: newQuestions,
																}));
															}}
														/>
														{question.correct.includes(answer) ? (
															<button
																className="text-white focus:ring-1 focus:ring-green-300 font-medium rounded-lg text-sm mb-2 px-2.5 py-2 bg-green-500 hover:bg-green-600 focus:outline-none"
																onClick={(event) => {
																	const newQuestions = [...quizzData.questions];
																	newQuestions[index].correct.push(answer);
																	setQuizzData((prevData) => ({
																		...prevData,
																		questions: newQuestions,
																	}));
																}}>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check w-7 h-7" viewBox="0 0 16 16">
																	<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
																</svg>
															</button>
														) : (
															<button
																className="text-white focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm mb-2 px-2.5 py-2 bg-gray-400 hover:bg-gray-500 focus:outline-none"
																onClick={(event) => {
																	const newQuestions = [...quizzData.questions];
																	newQuestions[index].correct = [answer];
																	setQuizzData((prevData) => ({
																		...prevData,
																		questions: newQuestions,
																	}));
																}}>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check w-7 h-7" viewBox="0 0 16 16">
																	<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
																</svg>
															</button>
														)}
														<button
															className="text-white focus:ring-1 focus:ring-red-300 font-medium rounded-lg text-sm mb-2 px-4 py-2 bg-red-500 hover:bg-red-600 focus:outline-none"
															onClick={(event) => {
																const newQuestions = [...quizzData.questions];
																newQuestions[index].answers.splice(answerIndex, 1);

																setQuizzData((prevData) => ({
																	...prevData,
																	questions: newQuestions,
																}));
															}}>
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
																<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
																<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
															</svg>
														</button>
													</div>
												))}
												{question.answers.length < 8 && (
													<button
														className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-5 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none"
														onClick={(event) => {
															const newQuestions = [...quizzData.questions];
															newQuestions[index].answers.push('');
															setQuizzData((prevData) => ({
																...prevData,
																questions: newQuestions,
															}));
														}}>
														+ Radio
													</button>
												)}
											</div>
										)}

										<div className="w-full flex justify-between mt-4 gap-3 items-center">
											<div className="inline-flex sm:px-28 px-10 items-center justify-center w-full">
												<hr className="w-full h-1 my-8 bg-gray-200 border-0 rounded" />
												<div className="absolute px-4 -translate-x-1/2 bg-white left-1/2">
													<button
														onClick={(event) => {
															const newQuestions = [...quizzData.questions];
															const insertIndex = index + 1;
															newQuestions.splice(insertIndex, 0, {
																question: '',
																answers: [''],
																type: '',
																correct: ['-'],
																point: 2,
																minusPointsIfWrong: 1,
															});
															setQuizzData((prevData) => ({
																...prevData,
																questions: newQuestions,
															}));
														}}
														type="button"
														className="text-white w-fit bg-gray-400 hover:bg-gray-500 focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-1 me-2 focus:outline-none flex items-center gap-1">
														<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-plus w-6 h-6" viewBox="0 0 16 16">
															<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
														</svg>
														<p className="hidden">Question</p>
													</button>
												</div>
											</div>
										</div>
									</div>
								))}
							</>
						) : session || status == 'loading' ? (
							<div className="flex justify-center items-center h-[calc(100vh-150px)]">
								<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
								</svg>
							</div>
						) : (
							<div className="flex justify-center items-center h-[calc(100vh-150px)]">
								<p>Please Sign In</p>
							</div>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
