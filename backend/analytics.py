import json
from datetime import datetime, timedelta
import os

# Path to the analytics JSON file
ANALYTICS_FILE = "../public/analytics.json"
QUESTION_ANALYTICS_FILE = "../public/question_analytics.json"
QUESTIONS_FILE = "../public/questions.json"

# Initialize analytics data if the file doesn't exist
if not os.path.exists(ANALYTICS_FILE):
    initial_data = {
        "total_questions": 0,
        "last_month_questions": 0,
        "today_activity": 0,
        "recent_uploads": 0,
        "recent_activity": [],
        "system_statistics": {
            "processing_speed": 1.2,
            "accuracy_rate": 98.0,
        },
    }
    with open(ANALYTICS_FILE, "w") as f:
        json.dump(initial_data, f, indent=4)

def load_analytics():
    """Load analytics data from the JSON file."""
    with open(ANALYTICS_FILE, "r") as f:
        return json.load(f)

def save_analytics(data):
    """Save analytics data to the JSON file."""
    with open(ANALYTICS_FILE, "w") as f:
        json.dump(data, f, indent=4)

def update_analytics_on_upload():
    """Update analytics data when a new question is uploaded."""
    data = load_analytics()

    # Update total questions
    data["total_questions"] += 1

    # Update today's activity
    data["today_activity"] += 1

    # Update recent uploads (last 24 hours)
    now = datetime.now()
    twenty_four_hours_ago = now - timedelta(hours=24)
    recent_uploads = 0
    for activity in data["recent_activity"]:
        activity_time = datetime.fromisoformat(activity["timestamp"])
        if activity_time >= twenty_four_hours_ago:
            recent_uploads += 1
    data["recent_uploads"] = recent_uploads

    # Add recent activity
    data["recent_activity"].append({
        "event": "New question uploaded",
        "timestamp": now.isoformat(),
    })

    # Save updated analytics data
    save_analytics(data)

def get_analytics():
    """Get analytics data for the frontend."""
    data = load_analytics()

    # Calculate percentage change from last month
    last_month_questions = data["last_month_questions"]
    current_questions = data["total_questions"]
    if last_month_questions > 0:
        percentage_change = ((current_questions - last_month_questions) / last_month_questions) * 100
    else:
        percentage_change = 0

    # Prepare analytics data for the frontend
    analytics_data = {
        "total_questions": data["total_questions"],
        "percentage_change": round(percentage_change, 2),
        "today_activity": data["today_activity"],
        "recent_uploads": data["recent_uploads"],
        "recent_activity": data["recent_activity"][-5:],  # Show last 5 activities
        "system_statistics": data["system_statistics"],
    }

    return analytics_data

def generate_question_analytics():
    # Load the questions data
    if not os.path.exists(QUESTIONS_FILE):
        print(f"⚠️ {QUESTIONS_FILE} does not exist.")
        return

    with open(QUESTIONS_FILE, "r") as f:
        questions_data = json.load(f)

    # Initialize analytics data structure
    analytics_data = {}

    # Process each question
    for question in questions_data:
        subject = question["subject"]
        difficulty = question["difficulty"]

        # Initialize subject data if it doesn't exist
        if subject not in analytics_data:
            analytics_data[subject] = {
                "total_questions": 0,
                "difficulty_distribution": {
                    "Easy": 0,
                    "Medium": 0,
                    "Hard": 0
                },
                "recent_activity": []
            }

        # Update total questions for the subject
        analytics_data[subject]["total_questions"] += 1

        # Update difficulty distribution
        if difficulty in analytics_data[subject]["difficulty_distribution"]:
            analytics_data[subject]["difficulty_distribution"][difficulty] += 1

    # Save the analytics data to question_analytics.json
    with open(QUESTION_ANALYTICS_FILE, "w") as f:
        json.dump(analytics_data, f, indent=4)

    print(f"✅ Generated {QUESTION_ANALYTICS_FILE} successfully.")

def load_question_analytics():
    """Load question analytics data from the JSON file."""
    generate_question_analytics()
    if not os.path.exists(QUESTION_ANALYTICS_FILE):
        return {"error": "Question analytics file not found"}
    
    with open(QUESTION_ANALYTICS_FILE, "r") as f:
        return json.load(f)

def get_question_analytics():
    """Retrieve question analytics for the frontend."""
    return load_question_analytics()