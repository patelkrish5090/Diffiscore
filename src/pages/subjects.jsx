import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageTransition } from "@/components/ui/page-transition"
import { Plus, Book, BarChart2, FileText, Settings } from "lucide-react"
import { subjects } from "@/lib/mock-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Subjects</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Manage and organize subjects in your question bank
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input id="name" placeholder="e.g., Mathematics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input id="code" placeholder="e.g., MATH101" />
                </div>
                <Button className="w-full">Create Subject</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>{subject.code}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Questions</span>
                      </div>
                      <p className="text-2xl font-bold">{subject.questionCount}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Difficulty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-primary/20 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "65%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">View Questions</Button>
                    <Button variant="ghost" size="sm">Analytics</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}