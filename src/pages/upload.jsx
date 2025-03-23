import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Upload, X, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UploadPage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
      }));
      setSelectedImages(prev => [...prev, ...newFiles]);
      toast.success(`${acceptedFiles.length} images selected`);
    },
  });

  const uploadFiles = async () => {
    if (selectedImages.length === 0) {
      toast.error("No images selected to process");
      return;
    }
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }
    if (!selectedDifficulty) {
      toast.error("Please select a difficulty");
      return;
    }

    const formData = new FormData();
    selectedImages.forEach(item => {
      formData.append('file', item.file);
    });
    formData.append('subject', selectedSubject);
    formData.append('difficulty', selectedDifficulty);

    const imagesToUpload = selectedImages.map(item => ({
      ...item,
      id: `${item.file.name}-${Date.now()}`,
      status: 'processing',
    }));
    setUploadedImages(imagesToUpload);
    setSelectedImages([]);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log("Response status:", response.status);
      console.log("Response body:", result);
      console.log("Images to upload:", imagesToUpload);

      if (response.status === 200 && Array.isArray(result.results)) {
        const updatedImages = imagesToUpload.map(item => {
          const itemFileName = item.file.name.toLowerCase().trim();
          const fileResult = result.results.find(r => r.filename.toLowerCase().trim() === itemFileName);
          console.log(`Matching ${itemFileName} with result:`, fileResult);

          if (fileResult && fileResult.message) {
            toast.success(`${fileResult.filename}: ${fileResult.message} (Tag: ${fileResult.tag}, Subject: ${fileResult.subject}, Difficulty: ${fileResult.difficulty})`);
            return { ...item, status: 'success', tag: fileResult.tag, subject: fileResult.subject, difficulty: fileResult.difficulty };
          } else if (fileResult && fileResult.error) {
            toast.error(`${fileResult.filename}: ${fileResult.error}`);
            return { ...item, status: 'error' };
          } else {
            console.log("No match found for:", itemFileName, "in results:", result.results);
            toast.error(`${item.file.name}: No matching result or unexpected format`);
            return { ...item, status: 'error' };
          }
        });
        setUploadedImages(updatedImages);
        console.log("Updated images:", updatedImages);
      } else {
        toast.error(`Upload failed: ${result.error || 'Unknown error'}`);
        setUploadedImages(prev => prev.map(img => ({ ...img, status: 'error' })));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to upload files: " + error.message);
      setUploadedImages(prev => prev.map(img => ({ ...img, status: 'error' })));
    }
  };

  const removeImage = (index, fromSelected = true) => {
    if (fromSelected) {
      setSelectedImages(prev => {
        const newImages = prev.filter((_, i) => i !== index);
        URL.revokeObjectURL(prev[index].preview);
        return newImages;
      });
      toast.info("Image removed from selection");
    } else {
      setUploadedImages(prev => {
        const newImages = prev.filter((_, i) => i !== index);
        URL.revokeObjectURL(prev[index].preview);
        return newImages;
      });
      toast.info("Image removed from uploaded list");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Upload Questions</h1>
        <p className="text-muted-foreground">
          Upload your exam questions for automatic processing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Drag and drop or click to select question images, then process them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Select onValueChange={setSelectedSubject} value={selectedSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="Geography">Geography</SelectItem>
                <SelectItem value="History">History</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedDifficulty} value={selectedDifficulty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-10 text-center transition-all",
                isDragActive
                  ? "border-primary/70 bg-primary/5"
                  : "border-muted hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium">
                {isDragActive ? "Drop the files here" : "Drop files here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports PNG, JPG, JPEG (up to 10MB each)
              </p>
            </div>
          </div>

          {selectedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Selected Images</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedImages.length} images
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedImages.map((item, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                        <img
                          src={item.preview}
                          alt={`Selected ${index + 1}`}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-6 h-6 text-white" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index, true);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full h-[80vh]">
                      <img
                        src={item.preview}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          )}

          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Uploaded Images</h3>
                <p className="text-sm text-muted-foreground">
                  {uploadedImages.length} images
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((item, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                        <img
                          src={item.preview}
                          alt={`Uploaded ${index + 1}`}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-6 h-6 text-white" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index, false);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                          {item.status === 'pending' && 'Pending...'}
                          {item.status === 'processing' && 'Processing...'}
                          {item.status === 'success' && `Tag: ${item.tag}, Subject: ${item.subject}, Difficulty: ${item.difficulty}`}
                          {item.status === 'error' && 'Error'}
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full h-[80vh]">
                      <img
                        src={item.preview}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          )}

          {(selectedImages.length > 0 || uploadedImages.length > 0) && (
            <Button
              size="lg"
              className="w-full"
              onClick={uploadFiles}
              disabled={selectedImages.length === 0 || !selectedSubject || !selectedDifficulty}
            >
              Process {selectedImages.length} Images
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}