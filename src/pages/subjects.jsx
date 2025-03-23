import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/ui/page-transition";
import { Plus, FileText, BarChart2, Settings, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";

export function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null); // State to store selected subject
  const [subjectQuestions, setSubjectQuestions] = useState([]); // State to store questions for the selected subject
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [subjectAnalytics, setSubjectAnalytics] = useState({}); // State to store subject analytics

  // Fetch subject analytics on component mount
  useEffect(() => {
    const fetchSubjectAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:5000/subjectanalytics");
        const data = await response.json();
        if (response.ok) {
          setSubjectAnalytics(data);
        } else {
          console.error("Failed to fetch subject analytics:", data.error);
        }
      } catch (error) {
        console.error("Error fetching subject analytics:", error);
      }
    };

    fetchSubjectAnalytics();
  }, []);

  // Function to fetch questions for a subject
  const fetchQuestionsForSubject = async (subject) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/questions");
      const data = await response.json();
      if (response.ok) {
        // Filter questions for the selected subject
        const filteredQuestions = data.questions.filter(
          (question) => question.subject === subject
        );
        setSubjectQuestions(filteredQuestions);
      } else {
        console.error("Failed to fetch questions:", data.error);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Columns for the DataTable
  const columns = [
    {
      accessorKey: "image_path",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={`http://localhost:5000/uploads/${row.original.image_path.replace(
            "../public/uploads/",
            ""
          )}`}
          alt="Question"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${row.original.difficulty === "Easy"
              ? "bg-green-100 text-green-800"
              : row.original.difficulty === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.difficulty}
        </span>
      ),
    },
  ];

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(subjectAnalytics).map(([subjectName, analytics]) => (
            <Card key={subjectName} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{subjectName}</CardTitle>
                    <CardDescription>{/* Add subject code if available */}</CardDescription>
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
                      <p className="text-2xl font-bold">{analytics.total_questions}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Difficulty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-primary/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                (analytics.difficulty_distribution.Easy /
                                  analytics.total_questions) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSubject(subjectName);
                        fetchQuestionsForSubject(subjectName);
                      }}
                    >
                      View Questions
                    </Button>
                    <Button variant="ghost" size="sm">Analytics</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog to display questions for the selected subject */}
        <Dialog open={!!selectedSubject} onOpenChange={(open) => !open && setSelectedSubject(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Questions for {selectedSubject}</DialogTitle>
            </DialogHeader>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <DataTable columns={columns} data={subjectQuestions} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}