import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const Donut = ({ data }) => {
	const [options, setOptions] = useState({});
	const [series, setSeries] = useState([]);

	useEffect(() => {
		const chartData = Object.entries(data).map(([label, value]) => ({ x: label, y: value }));

		console.log(chartData);
		setSeries(chartData.map((entry) => entry.y));
		setOptions({
			colors: ['#348888', '#22BABB', '#FA7F08', '#FF5F5D', '#FFB30D'],
			chart: {
				height: 320,
				width: '100%',
				type: 'donut',
			},
			stroke: {
				colors: ['transparent'],
				lineCap: '',
			},
			plotOptions: {
				pie: {
					donut: {
						labels: {
							show: true,
							name: {
								show: true,
								fontFamily: 'Inter, sans-serif',
								offsetY: 20,
							},
							total: {
								showAlways: true,
								show: true,
								label: 'Unique visitors',
								fontFamily: 'Inter, sans-serif',
								formatter: function (w) {
									const sum = w.globals.seriesTotals.reduce((a, b) => {
										return a + b;
									}, 0);
									return sum;
								},
							},
							value: {
								show: true,
								fontFamily: 'Inter, sans-serif',
								offsetY: -20,
								formatter: function (value) {
									return value;
								},
							},
						},
						size: '80%',
					},
				},
			},
			grid: {
				padding: {
					top: -2,
				},
			},
			labels: chartData.map((entry) => entry.x),
			dataLabels: {
				enabled: false,
			},
			legend: {
				position: 'bottom',
				fontFamily: 'Inter, sans-serif',
			},
			yaxis: {
				labels: {
					formatter: function (value) {
						return value;
					},
				},
			},
			xaxis: {
				labels: {
					formatter: function (value) {
						return value;
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

	return <ApexCharts options={options} series={series} type="donut" height={350} />;
};

export default Donut;
