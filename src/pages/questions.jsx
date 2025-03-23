import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { PageTransition } from "@/components/ui/page-transition"
import { Filter, Plus, Download, Loader2 } from "lucide-react"

const columns = [
  {
    accessorKey: "image_path",
    header: "Question",
    cell: ({ row }) => {
      const imagePath = row.getValue("image_path")
      const cleanPath = imagePath.replace("../public/uploads/", "")
      return (
        <div className="max-w-[200px]">
          <img 
            src={`http://localhost:5000/uploads/${cleanPath}`} 
            alt="Question" 
            className="w-16 h-16 object-cover rounded-md"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder-image.png" // Optional: Add a placeholder image
            }}
          />
        </div>
      )
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
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
            'bg-red-100 text-red-800'}`}
        >
          {difficulty}
        </span>
      )
    },
  },
]

export function QuestionsPage() {
  const [filters, setFilters] = useState({
    subject: "",
    difficulty: "",
  })
  const [questions, setQuestions] = useState([])
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:5000/questions")
        const data = await response.json()
        if (response.ok) {
          const fetchedQuestions = data.questions || []
          setQuestions(fetchedQuestions)
          setFilteredQuestions(fetchedQuestions)
        } else {
          console.error("Failed to fetch questions:", data.error)
        }
      } catch (error) {
        console.error("Error fetching questions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // Handle filtering
  useEffect(() => {
    let filtered = [...questions]
    
    if (filters.subject) {
      filtered = filtered.filter(q => 
        q.subject.toLowerCase() === filters.subject.toLowerCase()
      )
    }
    
    if (filters.difficulty) {
      filtered = filtered.filter(q => 
        q.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      )
    }

    setFilteredQuestions(filtered)
  }, [filters, questions])

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
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
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
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setFilters({ subject: "", difficulty: "" })}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredQuestions}
                pageSize={10}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}