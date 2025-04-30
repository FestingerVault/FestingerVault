import { useMemo } from 'react';

export type StackedBarChartDataType = {
	name: string;
	label: string;
	value: number;
	color: string;
};
type StackedBarChartProps = {
	data: StackedBarChartDataType[];
};

export type StackedBarChartWithPosition = StackedBarChartDataType & {
	width: number;
	x: number;
};

function calculateStackedBarPositions(
	data: StackedBarChartDataType[],
	width: number,
	padding: number
): StackedBarChartWithPosition[] {
	const totalValue = data.reduce(
		(sum, item) => sum + (item.value > 0 ? item.value : 0),
		0
	);
	const totalGaps = (data.length - 1) * padding;
	const availableWidth =
		width -
		totalGaps -
		data.filter((item) => item.value === 0).length * padding;

	let currentX = 0;

	return data.map((item) => {
		let width: number;

		if (item.value === 0) {
			width = padding;
		} else {
			width = Math.round((item.value / totalValue) * availableWidth);
		}

		const positionedItem = { ...item, width, x: currentX };

		currentX += width + padding;

		return positionedItem;
	});
}
const width = 300;
const height = 10;
const rounded = 5;
const padding = 5;
export function StackedBarChart({ data }: StackedBarChartProps) {
	const total = useMemo(
		() => data.reduce((sum, item) => sum + item.value, 0),
		[data]
	);
	if (total === 0) {
		return null;
	}
	const calculated = calculateStackedBarPositions(data, width, padding);
	return (
		<div className="flex flex-col gap-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${width} ${height}`}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				fill="none"
			>
				{calculated.map((item) => {
					return (
						<rect
							key={item.name}
							x={item.x}
							y={0}
							rx={rounded}
							width={item.width}
							height={height}
							fill={item.color}
							className="duration-400 transition-all"
							tabIndex={-1}
						/>
					);
				})}
			</svg>
			<div className="flex flex-row gap-4">
				{data.map((item) => (
					<div
						key={item.name}
						className="flex items-center gap-2"
					>
						<span
							className={`bg-chart block h-4 w-4 rounded-full`}
							style={{
								background: item.color
							}}
						></span>
						<div className="space-x-1 text-sm">
							<span>{item.value}</span>
							<span className="text-muted-foreground">
								{item.label}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
