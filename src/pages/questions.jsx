import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { PageTransition } from "@/components/ui/page-transition"
import { Filter, Plus, Download } from "lucide-react"
import { questions } from "@/lib/mock-data"

const columns = [
  {
    accessorKey: "text",
    header: "Question",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate">{row.getValue("text")}</div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty")
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
            difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}`
        }>
          {difficulty}
        </span>
      )
    },
  },
  {
    accessorKey: "marks",
    header: "Marks",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm">View</Button>
      </div>
    ),
  },
]

export function QuestionsPage() {
  const [filters, setFilters] = useState({
    subject: "",
    difficulty: "",
    type: "",
  })

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Questions Bank</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Manage and organize your question repository
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Narrow down questions by specific criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="w-[200px]">
                <Select
                  value={filters.subject}
                  onValueChange={(value) => setFilters({ ...filters, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[200px]">
                <Select
                  value={filters.difficulty}
                  onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[200px]">
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="written">Written</SelectItem>
                    <SelectItem value="numerical">Numerical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={questions}
              pageSize={10}
            />
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}