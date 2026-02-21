import pyttsx3 # type: ignore
from PyPDF2 import PdfReader # type: ignore
from flask import Flask, jsonify, render_template, request, url_for # type: ignore
from time import time

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/pdf-to-audio", methods=["POST"])
def pdf_to_audio():
    # get name of pdf file index.html
    book = request.files['pdf_file']
    # initialize book with pdfreader
    pdfreader = PdfReader(book)
    # get number of pages from pdf file
    pages = len(pdfreader.pages) # return page number of pdf

    # text to speech object
    player = pyttsx3.init()

    # read all data from each page of pdf
    all_text = ""

    for num in range(pages):
        text = pdfreader.pages[num].extract_text()
        if text:
            all_text += text

    if all_text:
        player.save_to_file(all_text, "static/output.mp3")
        player.runAndWait()
        audio_url = url_for("static", filename="output.mp3", v=int(time()))
        return jsonify({"audio_url": audio_url})

    return jsonify({"error": "No text found in PDF."}), 400

# to run, write python3 main.py in terminal,
# it will ask for a pdf file, 
# select the file and it will read the text from the pdf file.