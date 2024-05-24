import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const Pie = ({ data }) => {
	const [options, setOptions] = useState({});
	const [series, setSeries] = useState([]);

	useEffect(() => {
		const chartData = Object.entries(data).map(([label, value]) => ({ x: label, y: value }));

		setSeries(chartData.map((entry) => entry.y));
		setOptions({
			series: [52.8, 26.8, 20.4],
			colors: ['#1C64F2', '#16BDCA', '#9061F9'],
			chart: {
				height: 420,
				width: '100%',
				type: 'pie',
			},
			stroke: {
				colors: ['white'],
				lineCap: '',
			},
			plotOptions: {
				pie: {
					labels: {
						show: true,
					},
					size: '100%',
					dataLabels: {
						offset: -25,
					},
				},
			},
			labels: ['Direct', 'Organic search', 'Referrals'],
			dataLabels: {
				enabled: true,
				style: {
					fontFamily: 'Inter, sans-serif',
				},
			},
			legend: {
				position: 'bottom',
				fontFamily: 'Inter, sans-serif',
			},
			yaxis: {
				labels: {
					formatter: function (value) {
						return value + '%';
					},
				},
			},
			xaxis: {
				labels: {
					formatter: function (value) {
						return value + '%';
					},
				},
				axisTicks: {
					show: false,
				},
				axisBorder: {
					show: false,
				},
			},
		});
	}, [data]);

	return (
		<div>
			<ApexCharts options={options} series={[{ data: series }]} type="pie" height={350} />
		</div>
	);
};

export default Pie;
