import os

# Configuration
UPLOAD_FOLDER = '../public/uploads'
INDEX_PATH = "../faiss_index"
embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")

# Predefined tags mapping
predefined_tags = {
    "q1": "sick",
    "q2": "painted",
    "q3": "divisible",
    "q4": "sum",
    "q5": "election",
}

# Global variable for the FAISS index
vector_db = None

def initialize_faiss_index():
    """Initialize or load the FAISS index."""
    global vector_db
    image_folder = UPLOAD_FOLDER
    
    try:
        if os.path.exists(INDEX_PATH):
            vector_db = FAISS.load_local(INDEX_PATH, embeddings=embeddings, allow_dangerous_deserialization=True)
            print(f"✅ Index found at '{INDEX_PATH}', loaded successfully.")
        else:
            texts = list(predefined_tags.values())
            metadatas = [{"tag": tag, "image_path": os.path.join(image_folder, f"{img_name}.png")} 
                         for img_name, tag in predefined_tags.items()]
            vector_db = FAISS.from_texts(texts=texts, embedding=embeddings, metadatas=metadatas)
            vector_db.save_local(INDEX_PATH)
            print(f"💾 FAISS index initialized and saved at '{INDEX_PATH}'.")
        print("✅ FAISS index setup completed.")
    except Exception as e:
        print(f"⚠️ Error initializing FAISS index: {str(e)}")
        raise

def reset_database():
    """Reset the FAISS database by deleting the index and reinitializing it."""
    try:
        print("Resetting the database...")
        if os.path.exists(INDEX_PATH):
            os.remove(INDEX_PATH)
            print(f"🗑️ Deleted existing FAISS index at '{INDEX_PATH}'.")
        
        initialize_faiss_index()
        print("Reset completed successfully")
        return {"message": "Database reset successfully"}
    except Exception as e:
        print(f"⚠️ Error resetting database: {str(e)}")
        return {"error": f"Failed to reset database: {str(e)}"}

reset_database()

def get_vector_db():
    """Return the current FAISS vector database instance."""
    global vector_db
    return vector_db