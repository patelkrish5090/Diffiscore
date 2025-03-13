import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Search, Book, Clock, ArrowRight, Loader2 } from "lucide-react"
import { PageTransition } from "@/components/ui/page-transition"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function SearchPage() {
  const [searchPrompt, setSearchPrompt] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSearchResults([
      { id: 1, text: "What is the capital of France?", difficulty: "Easy", subject: "Geography" },
      { id: 2, text: "Explain Newton's First Law of Motion.", difficulty: "Medium", subject: "Physics" },
      { id: 3, text: "Solve for x: 2x + 5 = 13", difficulty: "Easy", subject: "Mathematics" },
    ])
    setIsSearching(false)
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Search Questions</h1>
          <p className="text-lg text-muted-foreground">
            Search through your question bank using natural language
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Query</CardTitle>
            <CardDescription>
              Describe what you're looking for in natural language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., Find physics questions about Newton's laws..."
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              className="min-h-[100px] text-lg"
            />
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleSearch}
              disabled={!searchPrompt || isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Questions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {searchResults.length} matching questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  <TabsTrigger value="easy">Easy</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="hard">Hard</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <Card key={result.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Book className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {result.subject}
                                </p>
                              </div>
                              <p className="font-medium">{result.text}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                result.difficulty === "Easy" ? "success" :
                                result.difficulty === "Medium" ? "warning" : "destructive"
                              }>
                                {result.difficulty}
                              </Badge>
                              <Button variant="ghost" size="icon">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}