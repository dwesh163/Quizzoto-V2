import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const Area = ({ data, answersPer }) => {
	const [options, setOptions] = useState({});
	const [series, setSeries] = useState([]);

	useEffect(() => {
		const chartData = Object.entries(answersPer).map(([label, value]) => ({ x: label, y: value }));

		setSeries(data);
		setOptions({
			xaxis: {
				show: true,
				categories: chartData.map((entry) => entry.x),
				labels: {
					show: true,
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-xs font-normal fill-gray-500',
					},
				},
				axisBorder: {
					show: false,
				},
				axisTicks: {
					show: false,
				},
			},
			yaxis: {
				show: false,
			},
			chart: {
				sparkline: {
					enabled: false,
				},
				height: '100%',
				width: '100%',
				type: 'area',
				fontFamily: 'Inter, sans-serif',
				dropShadow: {
					enabled: false,
				},
				toolbar: {
					show: false,
				},
			},
			tooltip: {
				enabled: true,
				x: {
					show: false,
				},
				y: {
					show: false,
				},
			},
			fill: {
				type: 'gradient',
				gradient: {
					opacityFrom: 0.55,
					opacityTo: 0,
					shade: '#1C64F2',
					gradientToColors: ['#1C64F2'],
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				width: 6,
			},
			legend: {
				show: false,
			},
			grid: {
				show: false,
			},
		});
	}, [data]);

	return <ApexCharts options={options} series={series} type="area" height={350} />;
};

export default Area;
