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

	const boolean = ['true', 'false'];

	const getData = async () => {
		if (status === 'authenticated') {
			const response = await fetch(`/api/quiz/create/${router.query.quizId}`);
			let data = await response.json();
			if (data === 404) {
				console.log('oui');
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
				const updatedQuestions = data.questions.map((question) => {
					if (question.type == 'checkboxes') {
						const updatedQuestion = { ...question };

						updatedQuestion.correct = updatedQuestion.correct.map((correctAnswer) => {
							return updatedQuestion.answers.indexOf(correctAnswer);
						});

						console.log(updatedQuestion);
						return updatedQuestion;
					} else {
						return question;
					}
				});

				data.questions = updatedQuestions;

				setQuizzData(data);
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
				<title>QuizzotoV2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Header />
				<div className="flex md:bg-[#fcfcfc] bg-white flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 mt-20">
					<div className="w-full mx-auto px-4 md:px-auto md:mt-6">
						{!loading ? (
							<>
								<div className="flex justify-between items-center mb-5">
									<h3 className="sm:text-3xl text-2xl font-bold text-gray-700">Create Quizz</h3>
									<div className="flex items-center">
										<button
											className="text-white bg-sky-700 hover:bg-sky-800 focus:ring-1 focus:ring-sky-300 font-medium rounded-lg sm:text-sm text-xs sm:px-5 px-2 sm:py-2.5 py-2 me-2 dark:bg-sky-500 dark:hover:bg-sky-600 focus:outline-none"
											onClick={(event) => {
												const createQuizz = async () => {
													fetch(`/api/setNewQuizz`, { method: 'POST', body: JSON.stringify(quizzData) }).then((result) => {
														return router.push({
															pathname: `/quizz`,
														});
													});
												};
												createQuizz();
											}}>
											Publish
										</button>
										<button
											disabled
											onClick={(event) => {
												const updatedQuestions = quiz.questions.map((question) => {
													if (question.type === 'checkboxes') {
														const updatedQuestion = { ...question };

														updatedQuestion.correct = updatedQuestion.correct.map((correctAnswer) => {
															return updatedQuestion.answers.indexOf(correctAnswer);
														});

														return updatedQuestion;
													} else {
														return question;
													}
												});

												quiz.questions = updatedQuestions;

												setQuizzData(quiz);
											}}
											type="button"
											className="text-white w-fit bg-gray-400 hover:bg-gray-500 focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-2.5 sm:py-2.5 py-2 me-2 focus:outline-none flex items-center gap-1">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy sm:w-6 w-4" viewBox="0 0 16 16">
												<path d="M11 2H9v3h2z" />
												<path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
											</svg>
											<p className="sm:flex hidden text-sm">Save</p>
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
												{question.answers.length < 4 && (
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
						) : (
							<div className="flex justify-center items-center h-80">
								<p>Please Sign In</p>
							</div>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
