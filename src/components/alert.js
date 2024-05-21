const Alert = ({ id, type, message, linkText, linkHref, onClose }) => {
	const alertStyles = {
		info: { main: 'text-blue-800 border-blue-300 bg-blue-50', button: 'ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8' },
		danger: { main: 'text-red-800 border-red-300 bg-red-50', button: 'ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8' },
		success: { main: 'text-green-800 border-green-300 bg-green-50', button: 'ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8' },
		warning: { main: 'text-yellow-800 border-yellow-300 bg-yellow-50', button: 'ms-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8' },
		dark: { main: 'text-gray-800 border-gray-300 bg-gray-50', button: 'ms-auto -mx-1.5 -my-1.5 bg-gray-50 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex items-center justify-center h-8 w-8' },
	};

	let formatType = '';

	if (type >= 500) {
		formatType = 'danger';
	} else if (type >= 400) {
		formatType = 'warning';
	} else if (type >= 300) {
		formatType = 'info';
	} else if (type >= 200) {
		formatType = 'success';
	} else {
		formatType = 'dark';
	}

	return (
		<div className="absolute right-3 top-24">
			<div id={id} className={`flex w-fit items-center p-4 mb-4 border-t-4 ${alertStyles[formatType].main}`} role="alert">
				<svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<div className="ms-3 text-sm font-medium pr-2">
					{message}{' '}
					<a href={linkHref} className="font-semibold underline hover:no-underline">
						{linkText}
					</a>
				</div>
				<button type="button" className={alertStyles[formatType].button} onClick={onClose} aria-label="Close">
					<span className="sr-only">Dismiss</span>
					<svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default Alert;
