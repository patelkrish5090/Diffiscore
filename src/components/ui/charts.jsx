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

export function LineChart() {
  const { primary } = useChartColors()

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Questions Processed",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: primary,
        tension: 0.1,
      },
    ],
  }

  return <Line data={data} options={{ responsive: true, maintainAspectRatio: false, height: 300 }} />
}

export function BarChart() {
  const { primary, primaryTransparent } = useChartColors()

  const data = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        label: "Questions Count",
        data: [45, 35, 20],
        backgroundColor: [
          primaryTransparent,
          "rgba(234, 179, 8, 0.5)",
          "rgba(239, 68, 68, 0.5)",
        ],
        borderColor: [
          primary,
          "rgb(234, 179, 8)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, height: 300 }} />
}

export function DoughnutChart() {
  const { primary, primaryTransparent } = useChartColors()

  const data = {
    labels: ["Mathematics", "Physics", "Chemistry", "Biology", "History"],
    datasets: [
      {
        data: [35, 28, 22, 18, 15],
        backgroundColor: [
          primaryTransparent,
          "rgba(16, 185, 129, 0.5)",
          "rgba(249, 115, 22, 0.5)",
          "rgba(168, 85, 247, 0.5)",
          "rgba(236, 72, 153, 0.5)",
        ],
        borderColor: [
          primary,
          "rgb(16, 185, 129)",
          "rgb(249, 115, 22)",
          "rgb(168, 85, 247)",
          "rgb(236, 72, 153)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false, height: 300 }} />
}