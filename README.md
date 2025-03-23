# DiffiScore: Automated Exam Question System

## Table of Contents

- [Overview](#overview)
- [Installation and Setup](#installation-and-setup)
- [Core Functionality](#core-functionality)
- [Frontend Features](#frontend-features)
- [Backend Integration](#backend-integration)
- [Testing](#testing)
- [Accessibility Considerations](#accessibility-considerations)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)

## Overview

DiffiScore is a web-based tool that streamlines exam question management for educational institutions. It allows users to upload question images, extract text via OCR, categorize questions, and retrieve relevant questions using natural language search. The system also provides analytics on question difficulty levels and subject distribution.

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/patelkrish5090/Diffiscore.git
cd Diffiscore
```

### Install Frontend Dependencies

```bash
npm install
```

### Run the Frontend Development Server

```bash
npm run dev
```

### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Install FAISS for Vector Database Support

```bash
pip install faiss-gpu  # Use this if you have a GPU
pip install faiss-cpu  # Use this if running without a GPU
```

### Install Google Generative ai

```bash
pip install google-generativeai
pip install google-genai
```

### Run the Backend Server

```bash
python backend/app.py
```

## Core Functionality

### 1. Image Upload & Processing

- Users can upload images containing exam questions.
- Extracts text from images using the Gemini OCR API.
- Stores metadata (subject, difficulty level, tags) for retrieval.

### 2. Prompt-Based Image Retrieval

- Users can search for questions using natural language queries.
- The system retrieves relevant questions using a vector database and LangChain-based retrieval.
- Retrieved questions can be copied, selected, and downloaded.

### 3. Question Paper Generation

- Users can select multiple questions from the search results.
- A quick question paper can be generated from selected questions.

### 4. Analytics and Insights

- Provides visualizations for question distribution by subject and difficulty level.
- Displays processing statistics for uploaded questions.

## Frontend Features

- _Intuitive UI_: Clean, professional, and user-friendly interface.
- _Customizable Themes_: Press Ctrl+C to tweak colors with a color picker.
- _Drag & Drop Upload_: Supports PNG and JPG images.
- _Responsive Design_: Works across desktops, tablets, and mobile devices.

## Backend Integration

- Uses FAISS for efficient similarity search in a vector database.
- Retrieves images and text based on user prompts.
- Designed to work seamlessly with LangChain and AI-based retrieval.

## Testing

- Unit tests implemented for core functionalities.
- Manual testing for frontend interactions and API calls.

## Accessibility Considerations

- High contrast UI for readability.
- Keyboard navigation support.
- Responsive design ensures usability across different screen sizes.

## Contributors

Team _Ctrl + Alt + Defeat_

- _Krish Patel_ – Team Lead + Developer
- _Yadu Krishnan_ – Developer
- _Tanishq Gupta_ – Developer
