from transformers import pipeline

print("Starting sentiment analysis test...")
# Load pretrained sentiment model
sentiment_pipeline = pipeline("sentiment-analysis")

texts = [
    "I love this product",
    "This service is horrible",
    "Delivery was late",
    "Great experience",
    "Worst app ever"
]

for text in texts:
    result = sentiment_pipeline(text)[0]
    print(f"Text: {text}")
    print(f"Sentiment: {result['label']}  Score: {result['score']}")
    print("-" * 40)
