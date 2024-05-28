import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ResultsList({ resultId }) {
	const [result, setResult] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!resultId) {
			return;
		}
		fetch(`/api/result/` + resultId)
			.then((response) => response.json())
			.then((jsonData) => {
				if (jsonData.error != 'Not Found') {
					setResult(jsonData);
					setIsLoading(false);
				} else {
					setResult('404');
				}
			});
	}, [resultId]);

	return (
		<>
			{isLoading ? (
				<div className="flex md:bg-[#fcfcfc]  flex-col max-w-6xl px-2 mx-auto items-center justify-center md:px-6 lg:px-8 h-[100vh]">
					{result == '404' ? (
						<p className="mt-4">Results not Found</p>
					) : (
						<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-sky-500 bg-opacity-90" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
					)}
				</div>
			) : (
				<div className="relative overflow-x-auto w-full">
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
							<tr>
								<th scope="col" className="px-3 py-3 pl-0 sm:table-cell hidden">
									Question
								</th>
								<th scope="col" className="px-0 py-3">
									Answers
								</th>
								<th scope="col" className="px-3 py-3 sm:table-cell hidden">
									Correct
								</th>
								<th scope="col" className="px-3 py-3 pr-0 sm:table-cell hidden">
									Points
								</th>
							</tr>
						</thead>
						<tbody>
							{result?.results?.map((result, index) => (
								<tr key={index} className="">
									<th className="px-0 py-4 pl-0 font-medium sm:hidden text-gray-900 gap-2 flex flex-col">
										{result.question}
										<div className="w-full flex gap-1 ">
											<div className="w-full flex flex-col gap-1">
												<div className={'w-full flex gap-1 ' + (result.points > 0 ? 'text-green-400' : 'text-red-500')}>
													{result.points > 0 ? <img src="/svg/correct.svg" /> : <img src="/svg/wrong.svg" />}
													{result.userAnswer.join(', ') != '' ? result.userAnswer.join(', ') : 'EMPTY'}
												</div>
												<div className="w-full flex gap-1 text-green-400">
													{result.points == 0 && <img src="/svg/correct.svg" />}
													{result.correctAnswer.join(', ') != result.userAnswer.join(', ') && result.correctAnswer.join(', ')}
												</div>
											</div>
											<div className="w-24">{result.points} Points</div>
										</div>
									</th>

									<th scope="row" className="px-3 py-4 pl-0 sm:table-cell hidden font-medium text-gray-900">
										{result.question}
									</th>
									<td className="px-3 py-4 font-medium sm:table-cell hidden gap-1">
										<div className={'w-full flex gap-1 ' + (result.points > 0 ? 'text-green-400' : 'text-red-500')}>
											{result.points > 0 ? <img src="/svg/correct.svg" /> : <img src="/svg/wrong.svg" />}
											{result.userAnswer.join(', ') != '' ? result.userAnswer.join(', ') : 'EMPTY'}
										</div>
									</td>
									<td className="px-3 py-4 font-medium sm:table-cell hidden">
										<div className="w-full flex gap-1 text-green-400">
											{result.points == 0 && <img src="/svg/correct.svg" />}
											{result.correctAnswer.join(', ') != result.userAnswer.join(', ') && result.correctAnswer.join(', ')}
										</div>
									</td>
									<td className="px-3 py-4 pr-0 font-medium sm:table-cell hidden text-center">{result.points}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr className="font-semibold text-gray-900 ">
								<th scope="row" className="px-3 py-3 pl-0 sm:table-cell hidden text-base">
									Total
								</th>
								<td className="px-3 py-3 sm:table-cell hidden"></td>
								<td className="px-3 py-3 sm:table-cell hidden"></td>
								<td className="px-3 py-3 pr-0 sm:table-cell hidden text-center">{result.points}</td>
							</tr>
						</tfoot>
					</table>
				</div>
			)}
		</>
	);
}
