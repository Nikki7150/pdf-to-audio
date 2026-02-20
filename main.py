import pyttsx3
from PyPDF2 import PdfReader
from tkinter.filedialog import *

# get name of pdf file from user
book = askopenfilename()
# initialize book with pdfreader
pdfreader = PdfReader(book)
# get number of pages from pdf file
pages = len(pdfreader.pages) # return page number of pdf

# text to speech object
player = pyttsx3.init()

# read all data from each page of pdf
for num in range(pages):
    page = pdfreader.pages[num] # gets seperate pages
    # extract text from pdf
    text = page.extract_text()
    if text:
        player.say(text)
player.runAndWait()

# to run, write python3 main.py in terminal,
# it will ask for a pdf file, 
# select the file and it will read the text from the pdf file.