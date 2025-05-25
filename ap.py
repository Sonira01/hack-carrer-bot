import os
from flask import Flask, request, render_template, session, redirect, url_for

# If generate_response is defined here, no need to import from chatbot
from google import genai
from google.genai import types


def generate_response(user_query: str,
                      conversation_history: list[dict],
                      api_key: str = None,
                      model: str = "gemini-2.5-flash-preview-04-17",
                      temperature: float = 0.8) -> str:
    """
    Generate a response from Google GenAI based on the user's query and previous conversation history.
    """
    # Set up API key
    key = "AIzaSyAy6DRDeEQO3inOQiaC4CH815ygmygoTb0"
    if not key:
        raise ValueError("Google GenAI API key must be provided or set in environment variable GOOGLE_GENAI_API_KEY")
    os.environ["GOOGLE_GENAI_API_KEY"] = key

    # Initialize client
    client = genai.Client(api_key=key)

    # Prepare message contents including history and new query
    contents = []
    for msg in conversation_history:
        part = types.Part.from_text(text=msg['content'])
        contents.append(types.Content(role=msg['role'], parts=[part]))

    # Append current user query
    contents.append(
        types.Content(
            role="user",
            parts=[ types.Part.from_text(text=user_query) ]
        )
    )

    # Define system instructions for behavior
    system_instructions = [
        types.Part.from_text(text="""
You are a friendly and knowledgeable career guidance assistant. Ask the user one thoughtful question at a time to understand their interests, strengths, and goals.
Keep your questions and responses short and clear. After each user reply, ask the next most relevant question.
Once you have enough information, suggest personalized career paths, skills to learn, and free or affordable resources.
""")
    ]

    # Configure generation settings
    generate_config = types.GenerateContentConfig(
        temperature=temperature,
        response_mime_type="text/plain",
        system_instruction=system_instructions
    )

    # Call the model and stream the response
    response_text = []
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_config,
    ):
        response_text.append(chunk.text)

    return ''.join(response_text)

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))  # use env var in production

@app.route("/", methods=["GET", "POST"])
def index():
    # Ensure templates/chat.html exists
    if 'history' not in session:
        session['history'] = []

    if request.method == "POST":
        user_input = request.form.get("user_input", "").strip()
        if user_input:
            session['history'].append({'role': 'user', 'content': user_input})
            reply = generate_response(user_input, session['history'])
            session['history'].append({'role': 'model', 'content': reply})
            session.modified = True

    return render_template("chat.html", history=session.get('history', []))

@app.route("/reset")
def reset():
    session.clear()
    return redirect(url_for("index"))

if __name__ == "__main__":
    # Default host and port
    app.run(debug=True)
