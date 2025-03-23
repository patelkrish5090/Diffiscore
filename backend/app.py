from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from langchain_community.vectorstores.faiss import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
import uuid
from flask_cors import CORS
from PIL import Image  # For image display (optional, for debugging)
from analytics import update_analytics_on_upload
from analytics import get_analytics
from analytics import get_question_analytics
from datetime import datetime, timedelta
import json  # Import json module

app = Flask(__name__, static_folder='../public', static_url_path='')
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Configuration
UPLOAD_FOLDER = '../public/uploads'  # Relative to backend/ folder
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
INDEX_PATH = "../public/faiss_index"  # Move FAISS index to root level too
QUESTIONS_JSON_PATH = "../public/questions.json"  # Path to store questions data
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")

# Predefined tags mapping
tags = {
    "q1": "sick",
    "q2": "painted",
    "q3": "divisible",
    "q4": "sum",
    "q5": "election",
}

# Initialize FAISS index
def initialize_faiss_index():
    global vector_db
    if os.path.exists(INDEX_PATH):
        # Load existing FAISS index
        vector_db = FAISS.load_local(INDEX_PATH, embeddings=embeddings, allow_dangerous_deserialization=True)
        print(f"✅ Index found at '{INDEX_PATH}', loaded successfully.")
    else:
        # Initialize FAISS index with a dummy text if no data is available
        dummy_text = "dummy"  # Use a dummy text to initialize the index
        vector_db = FAISS.from_texts(texts=[dummy_text], embedding=embeddings)
        vector_db.save_local(INDEX_PATH)
        print(f"💾 FAISS index initialized with dummy data and saved at '{INDEX_PATH}'.")
    
    print("✅ FAISS index setup completed.")

# Initialize the FAISS index when the app starts
vector_db = None
initialize_faiss_index()

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to update the questions JSON file
def update_questions_json(subject, difficulty, image_path):
    try:
        # Load existing data if the file exists
        if os.path.exists(QUESTIONS_JSON_PATH):
            with open(QUESTIONS_JSON_PATH, 'r') as f:
                questions_data = json.load(f)
        else:
            questions_data = []

        # Append the new question data
        questions_data.append({
            "subject": subject,
            "difficulty": difficulty,
            "image_path": image_path
        })

        # Write the updated data back to the file
        with open(QUESTIONS_JSON_PATH, 'w') as f:
            json.dump(questions_data, f, indent=4)

        print(f"💾 Updated questions JSON file with new entry: {image_path}")
    except Exception as e:
        print(f"⚠️ Error updating questions JSON file: {str(e)}")

# Route to upload images
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({"error": "No file part"}), 400
    
    files = request.files.getlist('file')
    if not files or all(file.filename == '' for file in files):
        print("No files selected")
        return jsonify({"error": "No selected files"}), 400

    # Get the subject and difficulty from the form data
    subject = request.form.get('subject')
    difficulty = request.form.get('difficulty')

    if not subject:
        print("No subject provided")
        return jsonify({"error": "No subject provided"}), 400

    if not difficulty:
        print("No difficulty provided")
        return jsonify({"error": "No difficulty provided"}), 400

    results = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename).replace("\\", "/")  # Normalize path
            file.save(file_path)
            print(f"Saved file: {file_path}")
            
            base_name = filename.split('.')[0]  # Extract filename without extension
            tag = tags.get(base_name, "unknown")  # Use predefined tags or default to "unknown"
            
            # Add the new image to the FAISS index with subject (but not difficulty)
            vector_db.add_texts(
                texts=[tag],
                metadatas=[{"tag": tag, "subject": subject, "image_path": file_path}],
                ids=[str(uuid.uuid4())]
            )
            print(f"Added to FAISS: {filename} with tag {tag} and subject {subject}")
            
            # Update the questions JSON file with subject, difficulty, and image path
            update_questions_json(subject, difficulty, file_path)

            results.append({
                "filename": filename,
                "tag": tag,
                "subject": subject,
                "difficulty": difficulty,
                "message": "File uploaded and processed successfully"
            })

            update_analytics_on_upload()
        else:
            print(f"Invalid file type: {file.filename}")
            results.append({
                "filename": file.filename,
                "error": "File type not allowed"
            })

    # Save the updated FAISS index
    vector_db.save_local(INDEX_PATH)
    print("💾 FAISS index updated successfully with multiple files.")
    
    response = jsonify({"results": results})
    print(f"Returning response: {response.get_data(as_text=True)}")
    return response, 200

# Route to get questions from the JSON file
@app.route('/questions', methods=['GET'])
def get_questions():
    try:
        # Check if the JSON file exists
        if not os.path.exists(QUESTIONS_JSON_PATH):
            return jsonify({"error": "No questions found"}), 404

        # Read the JSON file
        with open(QUESTIONS_JSON_PATH, 'r') as f:
            questions_data = json.load(f)

        # Return the questions data
        return jsonify({"questions": questions_data}), 200
    except Exception as e:
        print(f"⚠️ Error fetching questions: {str(e)}")
        return jsonify({"error": f"Failed to fetch questions: {str(e)}"}), 500

# Function to retrieve similar images
def retrieve_similar_images(query_text, vector_db, top_k=2):
    """
    Retrieve similar images based on a query text.

    Args:
        query_text (str): The query text to search for.
        vector_db (FAISS): The FAISS vector database.
        top_k (int): Number of similar results to retrieve.

    Returns:
        list: Retrieved metadata for the similar images.
    """
    try:
        # Embed the query text
        query_vector = embeddings.embed_documents([query_text])[0]

        # Perform similarity search
        results = vector_db.similarity_search_by_vector(query_vector, k=top_k)
        retrieved_metadata = []

        print(f"\n🔍 Query: {query_text}\n")

        for idx, result in enumerate(results, start=1):
            metadata = result.metadata
            image_path, tag = metadata.get('image_path'), metadata.get('tag')
            subject = metadata.get('subject')

            # Skip invalid results
            if not image_path or not tag or not subject:
                print(f"⚠️ Invalid metadata for result {idx}. Skipping...")
                continue

            print(f"{idx}. Tag: {tag}\n🔷 Subject: {subject}\n🔷 Image Path: {image_path}\n" + "─" * 40)
            retrieved_metadata.append(metadata)

        return retrieved_metadata  # Return only valid results

    except Exception as e:
        print(f"⚠️ Error retrieving similar images: {str(e)}")
        return []  # Return an empty list if an error occurs

# Route to search for similar images
@app.route('/search', methods=['POST'])
def search_images():
    data = request.json
    query_text = data.get('query')
    
    if not query_text:
        print("No query provided in request")
        return jsonify({"error": "No query provided"}), 400
    
    try:
        # Use the retrieve_similar_images function to get results
        retrieved_metadata = retrieve_similar_images(query_text, vector_db, top_k=2)
        
        # Filter out the dummy text and N/A values from the results
        filtered_metadata = [
            metadata for metadata in retrieved_metadata
            if metadata.get('tag') != "dummy" and  # Exclude dummy text
            metadata.get('tag') != "N/A" and       # Exclude N/A tags
            metadata.get('subject') != "N/A" and   # Exclude N/A subjects
            metadata.get('image_path') != "N/A"    # Exclude N/A image paths
        ]

        return jsonify({"results": filtered_metadata}), 200
    
    except Exception as e:
        print(f"⚠️ Search error: {str(e)}")
        return jsonify({"error": f"Search failed: {str(e)}"}), 500

# Route to reset the database
@app.route('/reset', methods=['POST'])
def reset_database():
    print("Received reset request")  # Debug log
    try:
        if os.path.exists(INDEX_PATH):
            os.remove(INDEX_PATH)
            print(f"🗑️ Deleted existing FAISS index at '{INDEX_PATH}'.")
        
        initialize_faiss_index()
        print("Reset completed successfully")
        return jsonify({"message": "Database reset successfully"}), 200
    except Exception as e:
        print(f"⚠️ Error resetting database: {str(e)}")
        return jsonify({"error": f"Failed to reset database: {str(e)}"}), 500
    
@app.route('/analytics', methods=['GET'])
def get_analytics_data():
    try:
        analytics_data = get_analytics()
        return jsonify(analytics_data), 200
    except Exception as e:
        print(f"⚠️ Error fetching analytics: {str(e)}")
        return jsonify({"error": f"Failed to fetch analytics: {str(e)}"}), 500
    
@app.route('/subjectanalytics', methods=['GET'])
def get_subject_analytics():
    try:
        analytics_data = get_question_analytics()
        return jsonify(analytics_data), 200
    except Exception as e:
        print(f"⚠️ Error fetching question analytics: {str(e)}")
        return jsonify({"error": f"Failed to fetch question analytics: {str(e)}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)