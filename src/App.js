import React, { useState, useEffect } from 'react';
import './App.css';

const cols = 15;
const rows = 15;

const surroundingCells = [
	[0, 1],
	[0, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
	[1, 0],
	[-1, 0],
];

function LifeBoard({ width, height, selectedCells, onCellClick, grid }) {
	const handleCellClick = (rowIndex, cellIndex) => {
		onCellClick(rowIndex, cellIndex);
	};

	return (
		<div className='board'>
			<h2>Life Board</h2>
			<table className='table'>
				<tbody>
					{grid.map((row, rowIndex) => (
						<tr key={rowIndex} className='tr'>
							{row.map((cell, cellIndex) => (
								<td
									key={`${rowIndex}-${cellIndex}`}
									className={`td cell ${cell ? 'alive' : ''} ${
										selectedCells.some(
											([selectedRowIndex, selectedCellIndex]) =>
												selectedRowIndex === rowIndex && selectedCellIndex === cellIndex
										)
											? 'selected'
											: ''
									}`}
									onClick={() => handleCellClick(rowIndex, cellIndex)}
								/>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function GameOfLife({ initialCells }) {
	const [grid, setGrid] = useState(() => {
		const newGrid = Array(rows)
			.fill()
			.map(() => Array(cols).fill(0));

		initialCells.forEach(([x, y]) => {
			newGrid[x][y] = 1;
		});

		return newGrid;
	});

	const [started, setStarted] = useState(false);
	const [selectedCells, setSelectedCells] = useState([]);

	useEffect(() => {
		let interval;

		if (started) {
			interval = setInterval(start, 700);
		} else {
			clearInterval(interval);
		}

		return () => {
			clearInterval(interval);
		};
	}, [started]);

	const start = () => {
		setGrid(prevGrid => {
			const newGrid = prevGrid.map((row, rowIndex) => {
				return row.map((cell, cellIndex) => {
					let sum = 0;
					surroundingCells.forEach(([x, y]) => {
						const newX = rowIndex + x;
						const newY = cellIndex + y;
						if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
							sum += prevGrid[newX][newY];
						}
					});
					if (sum < 2 || sum > 3) {
						return 0;
					}
					if (sum === 3 || (cell === 1 && sum === 2)) {
						return 1;
					}
					return cell;
				});
			});
			return newGrid;
		});
	};

	const handleCellClick = (rowIndex, cellIndex) => {
		const newGrid = [...grid];
		newGrid[rowIndex][cellIndex] = newGrid[rowIndex][cellIndex] ? 0 : 1;
		setGrid(newGrid);

		const cell = [rowIndex, cellIndex];
		if (
			selectedCells.some(
				([selectedRowIndex, selectedCellIndex]) => selectedRowIndex === rowIndex && selectedCellIndex === cellIndex
			)
		) {
			setSelectedCells(prevSelectedCells =>
				prevSelectedCells.filter(
					([selectedRowIndex, selectedCellIndex]) => selectedRowIndex !== rowIndex || selectedCellIndex !== cellIndex
				)
			);
		} else {
			setSelectedCells(prevSelectedCells => [...prevSelectedCells, cell]);
		}
	};

	const handleReset = () => {
		setStarted(false);
		const newGrid = Array(rows)
			.fill()
			.map(() => Array(cols).fill(0));
		setGrid(newGrid);
		setSelectedCells([]);
	};

	const handleToggleStart = () => {
		setStarted(prevStarted => !prevStarted);
	};

	return (
		<div className='game-of-life'>
			<h2>Game of Life</h2>
			<div className='button-container'>
				<button className='button' onClick={handleReset}>
					Reset
				</button>
				<button className='button' onClick={handleToggleStart}>
					{started ? 'Stop' : 'Start'}
				</button>
			</div>
			<div className='board'>
				<LifeBoard width={cols} height={rows} selectedCells={selectedCells} onCellClick={handleCellClick} grid={grid} />
			</div>
		</div>
	);
}

function App() {
	const initialCells = [];

	return (
		<div className='container'>
			<GameOfLife initialCells={initialCells} />
		</div>
	);
}

export default App;
