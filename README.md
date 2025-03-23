# 🎓 DiffiScore: AI-Powered Exam Question Management System



**DiffiScore** is a comprehensive system for managing, searching, and analyzing exam questions using AI-powered technology. Perfect for educators, test creators, and students looking to organize and find relevant study materials.

---

## 📋 Table of Contents
- 🌟 Features
- 🛠️ Installation Guide
- 🔧 Configuration
- 💻 Usage Guide
- 📚 Feature Details
- 🎨 Customization
- 🧩 System Architecture
- 🔄 API Endpoints
- ❓ Troubleshooting
- 🤝 Contributing

---

## 🌟 Features

### 🔍 AI-Powered Search
- **Natural Language Queries**: Ask questions like "Find algebra questions about equations" to get relevant results
- **Semantic Understanding**: System understands the meaning behind your search, not just keywords
- **Similar Question Matching**: Find questions related to your query even if they use different wording

### 📊 Analytics Dashboard
- **Processing Speed Metrics**: Track how quickly questions are processed
- **Subject Distribution**: See the breakdown of questions by subject
- **Difficulty Analysis**: Visualize question difficulty across subjects
- **Activity Tracking**: Monitor usage patterns and recent activity

### 🖼️ Image Management
- **Drag & Drop Uploads**: Easy upload interface for question images
- **Automatic Classification**: Sort questions by subject and difficulty
- **Zooming & Panning**: Examine questions in detail with zoom and pan controls
- **Gallery View**: Browse through questions visually

### 📝 Text Extraction
- **AI-Powered OCR**: Extract text from question images automatically
- **Question Content Search**: Find specific content within questions
- **Copy to Clipboard**: Easily copy extracted text for use elsewhere

### 📊 Subject Management
- **Subject Organization**: Group questions by academic subjects
- **Subject Analytics**: Detailed statistics for each subject
- **Question Counts**: Track the number of questions per subject

### 📄 Export Capabilities
- **PDF Generation**: Create PDF reports of search results
- **Included Images**: PDF reports include the original question images
- **Extracted Text**: Automatically includes text extraction in reports

### 🎨 Theme Customization
- **Dark/Light Mode**: Switch between themes based on preference
- **Color Picker**: Personalize the app's primary color
- **Real-Time Preview**: See color changes applied instantly

---

## 🛠️ Installation Guide

### System Requirements
- **Node.js**: v18 or higher
- **Python**: 3.10 or higher
- **Storage**: At least 500MB free space for dependencies and data
- **Memory**: Minimum 4GB RAM recommended

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/diffiscore.git
cd diffiscore
```

### Step 2: Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:5173

### Step 3: Backend Setup

#### Create and activate a Python virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python dependencies
```bash
cd backend
pip install -r requirements.txt
```

**What this installs:**
- **Flask**: Web server framework for the API
- **FAISS**: Facebook AI Similarity Search for efficient vector similarity searches
- **langchain-huggingface**: Integration with Hugging Face models for text embeddings
- **Pillow**: Python Imaging Library for image processing
- **reportlab**: PDF generation library
- **flask-cors**: Cross-Origin Resource Sharing support for API

#### Additional Dependencies
```bash
# Install these separately as they may have platform-specific requirements
pip install python-multipart opencv-python faiss-cpu
```

**What these do:**
- **python-multipart**: Handles file uploads
- **opencv-python**: Computer vision library for image processing
- **faiss-cpu**: CPU version of FAISS for vector similarity search

### Step 4: OCR Setup (Optional but Recommended)
```bash
# Windows
winget install TesseractOCR.Tesseract

# macOS
brew install tesseract

# Linux
sudo apt install tesseract-ocr
```

### Step 5: Start the Backend Server
```bash
# From the backend directory
python app.py
```

The backend API will be available at: http://localhost:5000

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```
VITE_APP_API_URL=http://localhost:5000
VITE_PRIMARY_COLOR=hsl(210, 80%, 60%)  # Default blue
VITE_THEME=dark  # Options: dark/light/system
```

### Backend Configuration
Key settings in app.py:

```python
# File upload configuration
UPLOAD_FOLDER = '../public/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Data storage locations
INDEX_PATH = "../public/faiss_index"
QUESTIONS_JSON_PATH = "../public/questions.json"
```

### Embedding Model
DiffiScore uses Hugging Face's `thenlper/gte-large` model for text embeddings. This can be changed in app.py:

```python
# Initialize embeddings
embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")
```

---

## 💻 Usage Guide

### Starting the Application
1. **Terminal 1** (Frontend):
   ```bash
   npm run dev
   ```

2. **Terminal 2** (Backend):
   ```bash
   cd backend
   python app.py
   ```

### Uploading Questions
1. Navigate to the **Upload** page
2. Drop image files or click to select them
3. Select the subject (e.g., Math, Physics, Biology)
4. Choose a difficulty level (Easy, Medium, Hard)
5. Click "Process Questions" to upload
6. Wait for confirmation toast notifications

### Searching Questions
1. Go to the **Search** page
2. Type a natural language query in the search box
   - Example: "Find questions about sick patients"
   - Example: "Show me algebra problems with sums"
3. Press Enter or click the Search button
4. View results grouped by subject and tag
5. Click on any image to view it in detail

### Using Text Extraction
1. Select a question image
2. Click the "Extract Text" button
3. Wait for the AI to process the image
4. View the extracted text in the panel
5. Use the copy button to copy text to clipboard

### Creating PDF Reports
1. Perform a search to get results
2. Select the questions you want to include
3. Click "Export to PDF"
4. Wait for processing (larger sets take longer)
5. Save the PDF when prompted

### Using the Color Picker
1. Press `Ctrl+C` anywhere in the application
2. Use the color sliders to adjust:
   - Hue: The base color (0-360)
   - Saturation: Color intensity (0-100%)
   - Lightness: Brightness level (0-100%)
3. See real-time preview of your changes
4. Click "Save" to apply your custom color

---

## 📚 Feature Details

### AI-Powered Search Technology
DiffiScore uses semantic search technology that understands the meaning behind your queries:

1. **Text Embeddings**: Converts questions and search queries into numerical vectors
2. **Vector Similarity**: Finds questions whose vectors are closest to your query vector
3. **FAISS Index**: Uses Facebook's FAISS for efficient similarity search
4. **Metadata Filtering**: Applies filters for subjects and difficulty levels

For example, searching for "algebra equations" might return questions about solving for x, even if they don't explicitly contain those words.

### Text Extraction Process
When you extract text from an image:

1. The image is sent to the backend server
2. The Gemini AI service processes the image
3. Text content is recognized and extracted
4. Results are returned and displayed
5. Images with clear, well-formatted text work best

### PDF Export System
The PDF export feature:

1. Collects all selected question data
2. Processes each image sequentially
3. Extracts text when available
4. Places images and text in a formatted PDF
5. Creates page breaks as needed
6. Returns a downloadable document

### Analytics Generation
The analytics dashboard shows:

1. **Processing Metrics**: Average time to process questions
2. **Question Distribution**: Breakdown by subject as pie charts
3. **Difficulty Analysis**: Histograms of difficulty levels
4. **Recent Activity**: Timeline of system usage
5. **Performance Trends**: Changes in processing time

---

## 🎨 Customization

### Theme Settings
DiffiScore supports multiple themes:

1. **Light Mode**: Bright theme for daytime use
2. **Dark Mode**: Reduced eye strain in low-light environments
3. **System Default**: Follows your operating system settings

Change themes using the toggle in the top navigation bar.

### Color Picker Tool
The custom color picker allows you to personalize the application's primary color:

1. **HSL Controls**: Adjust Hue, Saturation, and Lightness
2. **RGB Values**: See the corresponding RGB values
3. **Hex Code**: Copy the hex color code for use elsewhere
4. **Presets**: Select from common color presets
5. **Real-time Preview**: See changes before applying them

To access the color picker, press `Ctrl+C` or go to Settings > Appearance > Custom Colors.

### UI Scaling
Adjust the interface size for your screen:

1. Use browser zoom (Ctrl+ and Ctrl-)
2. The responsive design adapts to different screen sizes
3. Mobile-friendly layout for tablet and phone use

---

## 🧩 System Architecture

DiffiScore uses a modern client-server architecture:

### Frontend (React)
```
src/
├── components/     # Reusable UI components
├── pages/          # Application views
├── lib/            # Utility functions
├── types/          # TypeScript definitions
└── App.jsx         # Main application component
```

### Backend (Flask)
```
backend/
├── app.py          # Main API server and routes
├── analytics.py    # Data analysis functions
├── process.py      # Image and data processing
├── gemini_service.py # Text extraction service
└── requirements.txt # Python dependencies
```

### Data Storage
```
public/
├── faiss_index/    # Vector database for similarity search
├── uploads/        # Stored question images
├── questions.json  # Metadata for all questions
└── analytics.json  # Usage and performance metrics
```

### Data Flow
1. User uploads question images
2. Backend processes images and extracts features
3. Images stored in uploads directory
4. Features stored in FAISS vector database
5. Metadata saved to questions.json
6. User searches using natural language
7. Query converted to vector and compared in FAISS
8. Similar questions retrieved and displayed

---

## 🔄 API Endpoints

DiffiScore's backend provides these REST API endpoints:

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/upload` | POST | Upload question images | `file` (image files), `subject` (text), `difficulty` (text) |
| `/questions` | GET | Get all questions | None |
| `/search` | POST | Search for similar questions | `query` (text) |
| `/reset` | POST | Reset the database | None |
| `/analytics` | GET | Get system analytics | None |
| `/subjectanalytics` | GET | Get subject-specific analytics | None |
| `/extract-text` | POST | Extract text from image | `image_path` (text) |
| `/export-results` | POST | Create PDF from results | `results` (array of question objects) |

### Example API Usage

**Searching for questions (JavaScript):**
```javascript
const response = await fetch('http://localhost:5000/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'algebra equations' })
});
const data = await response.json();
```

**Extracting text from an image (JavaScript):**
```javascript
const response = await fetch('http://localhost:5000/extract-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image_path: 'path/to/image.jpg' })
});
const data = await response.json();
```

---

## ❓ Troubleshooting

### Common Issues and Solutions

#### Upload Failures
**Issue**: Files fail to upload or process
**Solutions**:
- Check that the file is a supported format (PNG, JPG, JPEG)
- Verify that the uploads folder exists and has write permissions
- Ensure file size is under 10MB
- Check backend console for specific error messages

#### Search Returns No Results
**Issue**: Searches don't return expected results
**Solutions**:
- Try more general search terms
- Ensure questions have been uploaded and processed
- Check if the FAISS index is initialized (faiss_index exists)
- Try resetting the database with the Reset button

#### Text Extraction Problems
**Issue**: Text extraction returns incorrect or no text
**Solutions**:
- Ensure the image has clear, legible text
- Check if OCR dependencies are installed correctly
- Try uploading a higher resolution image
- Images with hand-written text may have lower accuracy

#### PDF Export Fails
**Issue**: PDF export doesn't complete or has errors
**Solutions**:
- Verify all required Python packages are installed
