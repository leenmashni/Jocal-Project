from transformers import pipeline
from pymongo import MongoClient
from langdetect import detect
from bson import ObjectId
import torch
import re
from googletrans import Translator

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


translator = Translator()

def translate(text: str, src_lang: str, tgt_lang: str) -> str:
    try:
        result = translator.translate(text, src=src_lang, dest=tgt_lang)
        return result.text
    except Exception as e:
        print(" GoogleTrans failed:", e)
        return text 


client = MongoClient("mongodb+srv://sawsan:kzFUSu1DAucqE53h@cluster0.rwcyv8y.mongodb.net/jolocalDB?retryWrites=true&w=majority&appName=Cluster0")
db = client["jolocalDB"]
reviews = db["reviews"]
products = db["products"]


def clean_summary(text):
    junk_phrases = [
        "the and the oil was", "its wind cleared", "a prop to get me", "covering was bad"
    ]
    for phrase in junk_phrases:
        text = text.replace(phrase, "")
    if text.strip().endswith(("was", "and")):
        text = text.rsplit('.', 1)[0] + "."
    return text.strip()

# === Main Function ===
def summarize_reviews_for_product(product_id_str):
    review_docs = list(reviews.find({ "productId": product_id_str }))
    all_english_texts = []

    for doc in review_docs:
        comment = doc.get("comment", "").strip()
        if not comment:
            continue
        try:
            lang = detect(comment)
            if lang == "en":
                all_english_texts.append(comment)
            elif lang == "ar":
                translated = translate(comment, src_lang="ar", tgt_lang="en")
                print(f" Original AR: {comment}")
                print(f" Translated EN: {translated}")
                all_english_texts.append(translated)
        except:
            continue

    if not all_english_texts:
        print(f" No reviews to summarize for product {product_id_str}")
        return

    full_text = " ".join(all_english_texts)
    full_text = re.sub(r'\s+', ' ', full_text.strip())

    if len(full_text.split()) < 10:
        print(f"Not enough review content to summarize for product {product_id_str}")
        return

    if len(full_text) > 4000:
        full_text = full_text[:4000]

    word_count = len(full_text.split())

    if word_count < 150:
        summary = summarizer(full_text, max_length=50, min_length=25, do_sample=False)
    elif word_count < 500:
        summary = summarizer(full_text, max_length=100, min_length=50, do_sample=False)
    else:
        summary = summarizer(full_text, max_length=150, min_length=80, do_sample=False)

    summary_en = clean_summary(summary[0]['summary_text'])

    if len(summary_en.split()) < 5 or "..." in summary_en:
        print(f" Skipping save for product {product_id_str} due to weak summary.")
        return

    summary_ar = translate(summary_en, src_lang="en", tgt_lang="ar")

    result = products.update_one(
        { "_id": ObjectId(product_id_str) },
        { "$set": { "summary_en": summary_en, "summary_ar": summary_ar } }
    )

    if result.modified_count > 0:
        print(f" Saved summary for product {product_id_str}")
    else:
        print(f" Product {product_id_str} not found or already summarized.")

    print("English:", summary_en)
    print("Arabic:", summary_ar)
    print()

def summarize_all_products():
    product_ids = reviews.distinct("productId")
    print(f"Found {len(product_ids)} products with reviews.\n")

    for pid in product_ids:
        summarize_reviews_for_product(pid)

summarize_all_products()
