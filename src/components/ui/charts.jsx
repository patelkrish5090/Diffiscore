import { Line, Bar, Doughnut } from "react-chartjs-2"
import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const useChartColors = () => {
  const [colors, setColors] = useState(() => {
    const root = document.documentElement
    const style = getComputedStyle(root)
    const primary = style.getPropertyValue('--primary').trim()
    return {
      primary: `hsl(${primary})`,
      primaryTransparent: `hsla(${primary}, 0.5)`
    }
  })

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement
      const style = getComputedStyle(root)
      const primary = style.getPropertyValue('--primary').trim()
      setColors({
        primary: `hsl(${primary})`,
        primaryTransparent: `hsla(${primary}, 0.5)`
      })
    }

    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })

    return () => observer.disconnect()
  }, [])

  return colors
}

export function LineChart({ data, xKey, yKey, dataKey }) {
  const { primary } = useChartColors()

  const chartData = {
    labels: data.map(item => item[xKey]),
    datasets: [
      {
        label: "Questions Processed",
        data: data.map(item => item[yKey]),
        fill: false,
        borderColor: primary,
        backgroundColor: `hsla(${primary}, 0.1)`,
        tension: 0, // Changed from 0.4 to 0 for straight lines
        pointRadius: 4,
        pointHoverRadius: 6,
        stepped: false // Ensures straight lines between points
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} questions`
        }
      }
    }
  }

  return <Line data={chartData} options={options} />
}

export function BarChart({ data, xKey, yKey }) {
  const { primary, primaryTransparent } = useChartColors()

  const chartData = {
    labels: data.map(item => item[xKey]),
    datasets: [{
      label: "Questions Count",
      data: data.map(item => item[yKey]),
      backgroundColor: [
        "rgba(16, 185, 129, 0.5)",  // Easy - Green
        "rgba(234, 179, 8, 0.5)",   // Medium - Yellow
        "rgba(239, 68, 68, 0.5)",   // Hard - Red
      ],
      borderColor: [
        "rgb(16, 185, 129)",
        "rgb(234, 179, 8)",
        "rgb(239, 68, 68)",
      ],
      borderWidth: 1,
    }],
  }

  return <Bar 
    data={chartData} 
    options={{ 
      responsive: true, 
      maintainAspectRatio: false,
      height: 300 
    }} 
  />
}

export function DoughnutChart({ data, labelKey, valueKey }) {
  const { primary, primaryTransparent } = useChartColors()

  // Generate colors based on number of items
  const generateColors = (count) => {
    const colors = [
      [primaryTransparent, primary],
      ["rgba(16, 185, 129, 0.5)", "rgb(16, 185, 129)"],
      ["rgba(249, 115, 22, 0.5)", "rgb(249, 115, 22)"],
      ["rgba(168, 85, 247, 0.5)", "rgb(168, 85, 247)"],
      ["rgba(236, 72, 153, 0.5)", "rgb(236, 72, 153)"]
    ]
    return Array(count).fill().map((_, i) => colors[i % colors.length])
  }

  const chartData = {
    labels: data.map(item => item[labelKey]),
    datasets: [{
      data: data.map(item => item[valueKey]),
      backgroundColor: generateColors(data.length).map(([bg]) => bg),
      borderColor: generateColors(data.length).map(([_, border]) => border),
      borderWidth: 1
    }]
  }

  return <Doughnut 
    data={chartData} 
    options={{ 
      responsive: true, 
      maintainAspectRatio: false,
      height: 300
    }} 
  />
}