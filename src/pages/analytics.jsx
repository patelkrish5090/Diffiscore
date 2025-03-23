import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageTransition } from "@/components/ui/page-transition"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart, DoughnutChart } from "@/components/ui/charts"
import { Download, Brain, Target, Clock, Activity } from "lucide-react"
import { useState, useEffect } from "react"

export function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [subjectAnalytics, setSubjectAnalytics] = useState(null)
  const [questionsData, setQuestionsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [analyticsRes, subjectRes, questionsRes] = await Promise.all([
          fetch('http://localhost:5000/analytics'),
          fetch('http://localhost:5000/subjectanalytics'),
          fetch('http://localhost:5000/questions')
        ])

        const analyticsJson = await analyticsRes.json()
        const subjectJson = await subjectRes.json()
        const questionsJson = await questionsRes.json()
        console.log('analyticsJson:', analyticsJson)
        console.log('subjectJson:', subjectJson)
        console.log('questionsJson:', questionsJson)

        setAnalyticsData(analyticsJson)
        setSubjectAnalytics(subjectJson)
        setQuestionsData(questionsJson.questions)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  if (loading || !analyticsData || !subjectAnalytics || !questionsData) {
    return <div>Loading analytics data...</div>
  }

  // Line Chart: Process timestamps from /analytics recent_activity
  const processingTrends = analyticsData.recent_activity.map(activity => ({
    date: new Date(activity.timestamp).toLocaleDateString(),
    value: 1 // Each entry represents one question
  })).reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date)
    if (existing) {
      existing.value += 1
    } else {
      acc.push(curr)
    }
    return acc
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date))

  // Doughnut Chart: Subject distribution from /subjectanalytics
  const subjectDistribution = Object.entries(subjectAnalytics).map(([subject, data]) => ({
    name: subject,
    value: data.total_questions
  }))

  // Bar Chart: Difficulty distribution from /subjectanalytics
  const difficultyDistribution = Object.values(subjectAnalytics).reduce((acc, subject) => {
    Object.entries(subject.difficulty_distribution).forEach(([level, count]) => {
      acc[level] = (acc[level] || 0) + count
    })
    return acc
  }, {})

  const difficultyChartData = Object.entries(difficultyDistribution).map(([level, count]) => ({
    name: level,
    value: count
  })).sort((a, b) => {
    const order = ['Easy', 'Medium', 'Hard']
    return order.indexOf(a.name) - order.indexOf(b.name)
  })

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Detailed insights and statistics about your question bank
            </p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Processing Speed</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.system_statistics.processing_speed}s</div>
              <p className="text-xs text-muted-foreground">Average per question</p>
              <Progress value={75} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.system_statistics.accuracy_rate}%</div>
              <p className="text-xs text-muted-foreground">Question analysis accuracy</p>
              <Progress value={analyticsData.system_statistics.accuracy_rate} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.today_activity}</div>
              <p className="text-xs text-muted-foreground">Questions processed</p>
              <Progress value={(analyticsData.today_activity / analyticsData.total_questions) * 100} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Brain className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.total_questions}</div>
              <p className="text-xs text-muted-foreground">In database</p>
              <Progress value={85} className="mt-3" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Question Processing Trends</CardTitle>
              <CardDescription>Daily question processing volume</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart 
                data={processingTrends}
                xKey="date"
                yKey="value"
                dataKey="value"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Subject Distribution</CardTitle>
              <CardDescription>Questions by subject area</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {console.log('subjectDistribution:', subjectDistribution)}
              <DoughnutChart 
                data={subjectDistribution}
                labelKey="name"
                valueKey="value"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Difficulty Distribution</CardTitle>
              <CardDescription>Questions by difficulty level</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart 
                data={difficultyChartData}
                xKey="name"
                yKey="value"
                dataKey="value"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}