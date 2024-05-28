import ReactCanvasConfetti from 'react-canvas-confetti';
import React, { useEffect, useRef } from 'react';

const commonOptions = {
	spread: 360,
	ticks: 600,
	gravity: 1,
	angle: 90,
	decay: 0.94,
	scalar: 1.2,
	startVelocity: 20,
	colors: ['7D6CEC', 'F33474', 'F9805A', 'FDDC75', '3FC9FF'],
	shapes: ['circle', 'square'],
	zIndex: 100,
};

export default function Confetti() {
	const instance = useRef();

	const onInit = ({ confetti }) => {
		instance.current = confetti;
	};

	const fire = () => {
		Array.from({ length: 8 }).forEach((_, index) => {
			setTimeout(() => {
				instance.current({
					...commonOptions,
					origin: { x: Math.random(), y: Math.random() },
					particleCount: Math.floor(Math.random() * 100) + 100,
				});
			}, index * 150);
		});
	};

	useEffect(() => {
		fire();
	}, []);

	return (
		<>
			<ReactCanvasConfetti onInit={onInit} />
		</>
	);
}
