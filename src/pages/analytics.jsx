import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageTransition } from "@/components/ui/page-transition"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, DoughnutChart } from "@/components/ui/charts"
import { Download, Calendar, Brain, Target, Clock, Activity } from "lucide-react"
import { analyticsData } from "@/lib/mock-data"

export function AnalyticsPage() {
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
              <div className="text-2xl font-bold">{analyticsData.processingSpeed}s</div>
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
              <div className="text-2xl font-bold">{analyticsData.accuracy}%</div>
              <p className="text-xs text-muted-foreground">Question analysis accuracy</p>
              <Progress value={analyticsData.accuracy} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.processedToday}</div>
              <p className="text-xs text-muted-foreground">Questions processed</p>
              <Progress value={45} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Brain className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalQuestions}</div>
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
              <LineChart />
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
              <DoughnutChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Difficulty Distribution</CardTitle>
              <CardDescription>Questions by difficulty level</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}