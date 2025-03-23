import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Image as ImageIcon,
  Download,
  ZoomIn,
  Loader2,
} from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { DataTable } from "@/components/ui/data-table";

export function SearchPage() {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchPrompt.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    try {
      // Step 1: Perform the search
      const searchResponse = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchPrompt }),
      });

      const searchResult = await searchResponse.json();

      if (searchResponse.ok && searchResult.results) {
        // Step 2: Fetch difficulty for each search result
        const questionsResponse = await fetch("http://localhost:5000/questions");
        const questionsData = await questionsResponse.json();

        // Map through search results and add difficulty
        const resultsWithDifficulty = searchResult.results.map((item) => {
          const question = questionsData.questions.find(
            (q) => q.image_path === item.image_path
          );
          return {
            ...item,
            difficulty: question ? question.difficulty : "Unknown",
          };
        });

        setSearchResults(
          resultsWithDifficulty.map((item, index) => ({
            id: index + 1,
            tag: item.tag,
            image_path: item.image_path,
            subject: item.subject,
            difficulty: item.difficulty,
          }))
        );
        toast.success(`Found ${searchResult.results.length} matching images`);
      } else {
        toast.error(searchResult.error || "Search failed");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search images: " + error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownload = (imagePath) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/uploads/${imagePath.replace(
      "../public/uploads/",
      ""
    )}`;
    link.download = imagePath.split("/").pop();
    link.click();
  };

  // Group results by tag
  const groupedByTag = searchResults.reduce((acc, result) => {
    acc[result.tag] = acc[result.tag] || [];
    acc[result.tag].push(result);
    return acc;
  }, {});

  // Define columns for DataTable
  const columns = [
    {
      accessorKey: "preview",
      header: "Preview",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={`http://localhost:5000/uploads/${row.original.image_path.replace(
                "../public/uploads/",
                ""
              )}`}
              alt={row.original.tag}
              className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/150?text=Image+Not+Found")
              }
            />
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full">
            <div className="flex flex-col items-center gap-4">
              <TransformWrapper>
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <div className="flex gap-4 mb-4">
                      <Button variant="outline" onClick={() => zoomIn()}>
                        <ZoomIn className="mr-2 h-4 w-4" />
                        Zoom In
                      </Button>
                      <Button variant="outline" onClick={() => zoomOut()}>
                        <ZoomIn className="mr-2 h-4 w-4" />
                        Zoom Out
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => resetTransform()}
                      >
                        <ZoomIn className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                    <TransformComponent>
                      <img
                        src={`http://localhost:5000/uploads/${row.original.image_path.replace(
                          "../public/uploads/",
                          ""
                        )}`}
                        alt={row.original.tag}
                        className="max-w-full max-h-[70vh] object-contain"
                      />
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(row.original.image_path)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "tag",
      header: "Tag",
      cell: ({ row }) => (
        <span className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
          {row.original.tag}
        </span>
      ),
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => {
        const difficulty = row.getValue("difficulty");
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {difficulty}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload(row.original.image_path)}
        >
          <Download className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Search Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Search through your question bank using natural language
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Query</CardTitle>
            <CardDescription>
              Search for images by tag (e.g., "sick", "sum", "election")
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., Find images related to 'sick' or 'sum'..."
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
                Found {searchResults.length} matching images, grouped by tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={Object.keys(groupedByTag)[0] || "all"}
                className="w-full"
              >
                <TabsList className="w-full justify-start mb-4">
                  {Object.keys(groupedByTag).map((tag) => (
                    <TabsTrigger key={tag} value={tag}>
                      {tag} ({groupedByTag[tag].length})
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(groupedByTag).map(([tag, results]) => (
                  <TabsContent key={tag} value={tag}>
                    <DataTable columns={columns} data={results} pageSize={5} />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}