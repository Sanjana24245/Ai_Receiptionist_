import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import nltk

# Download nltk data (run only once)
nltk.download('punkt')
nltk.download('stopwords')

# Load CSV
data = pd.read_csv("intents.csv")

# Features (X) and Labels (y)
X = data['text']
y = data['response']

# Convert text to vectors
vectorizer = TfidfVectorizer()
X_vectors = vectorizer.fit_transform(X)

# Train model
model = LogisticRegression()
model.fit(X_vectors, y)

# Save model & vectorizer
with open("chat_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("✅ Model training complete! Saved as chat_model.pkl and vectorizer.pkl")
