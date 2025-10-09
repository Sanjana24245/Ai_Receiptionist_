import ollama

def get_ai_reply(user_message: str) -> str:
    try:
        response = ollama.chat(
            model="llama3:latest",
            messages=[{"role": "user", "content": user_message}]
        )
        return response["message"]["content"]
    except Exception as e:
        print("❌ Ollama error:", e)
        return "Sorry, I’m having trouble answering right now."

if __name__ == "__main__":
    reply = get_ai_reply("Hello, who are you?")
    print("🤖 AI Reply:", reply)