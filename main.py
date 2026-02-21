
from PyPDF2 import PdfReader # type: ignore
from flask import Flask, render_template, request, send_file # type: ignore
from gtts import gTTS # type: ignore
import io

app = Flask(__name__)

#generate audio in memory using gTTS
def generate_tts_audio(text, lang='en'):
    """Generates gTTS audio as a BytesIO object."""
    mp3_fp = io.BytesIO()
    tts = gTTS(text=text, lang=lang, slow=False)
    tts.write_to_fp(mp3_fp)
    # Seek back to the start of the stream
    mp3_fp.seek(0)
    return mp3_fp

# Route for the home page
@app.route("/")
def home():
    return render_template("index.html")

# Route to handle PDF upload and conversion to audio
@app.route("/pdf-to-audio", methods=["POST"])
def pdf_to_audio():
    if 'pdf_file' not in request.files:
        return "No file uploaded", 400
    
    # get name of pdf file index.html
    book = request.files['pdf_file']
    # initialize book with pdfreader
    pdfreader = PdfReader(book)

    # read all data from each page of pdf
    all_text = ""

    for page in pdfreader.pages:
        text = page.extract_text()
        if text:
            all_text += text

        if not all_text.strip():
            return "No text found in the PDF", 400
        
    # generate audio using gTTS
    audio_stream = generate_tts_audio(all_text)

    return send_file(
        audio_stream,
        mimetype='audio/mpeg'
    )

if __name__ == "__main__":
    app.run()