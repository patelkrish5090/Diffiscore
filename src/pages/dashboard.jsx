import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Search, BarChart, TrendingUp, Clock, Users } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

export function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState({
    total_questions: 0,
    percentage_change: 0,
    today_activity: 0,
    recent_uploads: 0,
    recent_activity: [], // Initialize as an empty array
    system_statistics: {
      processing_speed: 0,
      accuracy_rate: 0,
    },
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/analytics");
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-lg text-muted-foreground">
            Monitor your exam system statistics and performance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <BarChart className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.total_questions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{analyticsData.percentage_change}% from last month
              </p>
              <Progress value={analyticsData.percentage_change} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.today_activity}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Questions processed
              </p>
              <Progress value={analyticsData.today_activity} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
              <Upload className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.recent_uploads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                In the last 24 hours
              </p>
              <Progress value={analyticsData.recent_uploads} className="mt-3" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest exam system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recent_activity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {/* <Button variant="ghost" size="sm">View</Button> */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>System Statistics</CardTitle>
              <CardDescription>Overall system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Processing Speed</p>
                    <p className="text-xs text-muted-foreground">Average time per question</p>
                  </div>
                  <p className="text-2xl font-bold">{analyticsData.system_statistics.processing_speed}s</p>
                </div>
                <Progress value={analyticsData.system_statistics.processing_speed} className="mt-2" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Accuracy Rate</p>
                    <p className="text-xs text-muted-foreground">Question analysis accuracy</p>
                  </div>
                  <p className="text-2xl font-bold">{analyticsData.system_statistics.accuracy_rate}%</p>
                </div>
                <Progress value={analyticsData.system_statistics.accuracy_rate} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}