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
  Copy,
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
  const [isExtracting, setIsExtracting] = useState(false);

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

  const handleDownload = async (imagePath) => {
    try {
      // Clean the image path
      const cleanPath = imagePath.replace("../public/uploads/", "");
      const imageUrl = `http://localhost:5000/uploads/${cleanPath}`;
      
      // Fetch the image as blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create object URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = cleanPath.split("/").pop(); // Get filename from path
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  // ...existing code...
  const handleExtractText = async (imagePath) => {
      try {
          setIsExtracting(true);
          const cleanPath = imagePath.replace("../public/uploads/", "");
          
          const response = await fetch("http://localhost:5000/extract-text", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ image_path: cleanPath }),
          });
          
          if (!response.ok) {
              throw new Error('Failed to extract text');
          }
  
          const result = await response.json();
          
          if (result.text) {
              await navigator.clipboard.writeText(result.text);
              toast.success("Text copied to clipboard", {
                  description: result.text.substring(0, 100) + "..."
              });
          } else {
              throw new Error(result.error || 'No text extracted');
          }
      } catch (error) {
          console.error("Text extraction failed:", error);
          toast.error(error.message || "Failed to extract text");
      } finally {
          setIsExtracting(false);
      }
  };
  const handleExportResults = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Preparing export...");
  
      // Validate search results
      if (!searchResults || searchResults.length === 0) {
        toast.error("No results to export");
        return;
      }
  
      // Map and clean results with validation
      const cleanedResults = searchResults.map(result => {
        if (!result.image_path) {
          throw new Error(`Missing image path for result: ${result.tag}`);
        }
        return {
          ...result,
          image_path: result.image_path.replace("../public/uploads/", "")
        };
      });
  
      // Send to backend for processing and PDF generation
      const response = await fetch("http://localhost:5000/export-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: cleanedResults }),
      });
  
      if (!response.ok) {
        throw new Error('Export failed: ' + response.statusText);
      }
  
      // Handle successful response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'search-results.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      // Show success message
      toast.dismiss(loadingToast);
      toast.success("Successfully exported results to PDF", {
        description: `Exported ${cleanedResults.length} questions`
      });
  
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export results", {
        description: error.message
      });
    }
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
                <Button
                    variant="outline"
                    onClick={() => handleExtractText(row.original.image_path)}
                    disabled={isExtracting}
                >
                    {isExtracting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Extracting...
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-4 w-4" />
                            Extract Text
                        </>
                    )}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Search Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Search through your question bank using natural language
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportResults}
              disabled={searchResults.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Question Paper
            </Button>
          </div>
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