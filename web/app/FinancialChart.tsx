import React, { useEffect, useRef } from 'react';
import './FinancialChart.css'; // Import the CSS file

interface FinancialChartProps {
  totalDebt: number;
  income: number;
  saving: number;
  fixedExpense: number;
  variableExpense: number;
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  totalDebt,
  income,
  saving,
  fixedExpense,
  variableExpense,
}) => {
  const donutCanvasRef = useRef<HTMLCanvasElement>(null);
  const stackedBarCanvasRef = useRef<HTMLCanvasElement>(null);
  const debtSavingCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Data setup
    const data = [income, saving, fixedExpense, variableExpense, totalDebt];
    const labels = ['Income', 'Savings', 'Fixed Expenses', 'Variable Expenses', 'Total Debt'];
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#FFC107', '#F44336'];

    // Max value for scaling
    const maxData = Math.max(...data);

    // Donut Chart
    const donutCanvas = donutCanvasRef.current;
    if (donutCanvas) {
      const ctx = donutCanvas.getContext('2d');
      if (ctx) {
        const total = data.reduce((sum, value) => sum + value, 0);
        let startAngle = 0;

        ctx.clearRect(0, 0, donutCanvas.width, donutCanvas.height);
        const centerX = donutCanvas.width / 2;
        const centerY = donutCanvas.height / 2;
        const radius = Math.min(donutCanvas.width, donutCanvas.height) / 2 - 20;

        data.forEach((value, index) => {
          const sliceAngle = (value / total) * 2 * Math.PI;

          // Draw slice
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
          ctx.closePath();
          ctx.fillStyle = colors[index];
          ctx.fill();

          // Add percentage labels
          const midAngle = startAngle + sliceAngle / 2;
          const textX = centerX + (radius / 1.5) * Math.cos(midAngle);
          const textY = centerY + (radius / 1.5) * Math.sin(midAngle);
          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${Math.round((value / total) * 100)}%`, textX, textY);

          startAngle += sliceAngle;
        });

        // Add legend
        labels.forEach((label, index) => {
          ctx.fillStyle = colors[index];
          ctx.fillRect(20, 20 + index * 20, 10, 10);
          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.fillText(label, 40, 30 + index * 20);
        });
      }
    }

    // Stacked Bar Chart
    const stackedBarCanvas = stackedBarCanvasRef.current;
    if (stackedBarCanvas) {
      const ctx = stackedBarCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, stackedBarCanvas.width, stackedBarCanvas.height);

        let currentX = 20; // Starting point
        const barHeight = 30;
        const totalWidth = stackedBarCanvas.width - 40;

        data.forEach((value, index) => {
          const barWidth = (value / data.reduce((sum, val) => sum + val, 0)) * totalWidth;

          // Draw bar
          ctx.fillStyle = colors[index];
          ctx.fillRect(currentX, stackedBarCanvas.height / 2 - barHeight / 2, barWidth, barHeight);

          // Add label
          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(labels[index], currentX + barWidth / 2, stackedBarCanvas.height / 2 + barHeight);

          currentX += barWidth;
        });
      }
    }

    // Debt vs Saving Chart
    const debtSavingCanvas = debtSavingCanvasRef.current;
    if (debtSavingCanvas) {
      const ctx = debtSavingCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, debtSavingCanvas.width, debtSavingCanvas.height);

        const periods = 12;
        const savingGrowth = Array.from({ length: periods }, (_, i) => saving * (i + 1));
        const debtGrowth = Array.from({ length: periods }, (_, i) => totalDebt - totalDebt * (i / periods));

        const barWidth = 20;
        const gap = 15;

        savingGrowth.forEach((save, index) => {
          const x = index * (barWidth * 2 + gap) + 40;

          // Draw Debt Bar
          ctx.fillStyle = '#F44336';
          ctx.fillRect(x, 200 - (debtGrowth[index] / maxData) * 150, barWidth, (debtGrowth[index] / maxData) * 150);

          // Draw Saving Bar
          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(x + barWidth + gap, 200 - (save / maxData) * 150, barWidth, (save / maxData) * 150);

          // Add labels
          ctx.fillStyle = '#000';
          ctx.font = '10px Arial';
          ctx.fillText(`P${index + 1}`, x + barWidth / 2, 220);
        });

        // Add legend
        ctx.fillStyle = '#F44336';
        ctx.fillRect(500, 20, 10, 10);
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText('หนี้', 520, 30);

        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(500, 40, 10, 10);
        ctx.fillStyle = '#000';
        ctx.fillText('เงินเก็บ', 520, 50);
      }
    }
  }, [totalDebt, income, saving, fixedExpense, variableExpense]);

  return (
    <div className="financial-chart-container">
      <h3>Outcome Portion</h3>
      <canvas ref={donutCanvasRef} width={300} height={300}></canvas>

      {/* <h3>Income vs Outcome</h3>
      <canvas ref={stackedBarCanvasRef} width={500} height={150}></canvas> */}

      <h3>Debt vs Saving</h3>
      <canvas ref={debtSavingCanvasRef} width={600} height={250}></canvas>
    </div>
  );
};

export default FinancialChart;