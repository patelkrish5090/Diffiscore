import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDropzone } from "react-dropzone"
import { Upload, Image as ImageIcon, X, Maximize2, Minimize2 } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function UploadPage() {
  const [uploadedImages, setUploadedImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles) => {
      setUploadedImages(prev => [...prev, ...acceptedFiles])
      toast.success(`${acceptedFiles.length} images uploaded successfully`)
    }
  })

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    toast.info("Image removed")
  }

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
            Drag and drop or click to upload question images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              Supports PNG, JPG (up to 10MB each)
            </p>
          </div>

          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Uploaded Images</h3>
                <p className="text-sm text-muted-foreground">
                  {uploadedImages.length} images
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((file, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-6 h-6 text-white" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeImage(index)
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full h-[80vh]">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>

              <Button 
                size="lg"
                className="w-full"
              >
                Process {uploadedImages.length} Images
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}