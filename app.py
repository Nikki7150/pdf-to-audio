from flask import Flask, redirect, url_for

app = Flask(__name__)

#get a route for flask
@app.route("/") #path to get to function
#start a website so define the pages in website
def home(): #represdents home page
    return "Hello this is the main page <h1>Hello</h1>" #inline html in a function
@app.route("/<name>") #dynamic route, name is a variable
def user(name): 
    return f"Hello {name}!"
#redirect things
@app.route("/admin")
def admin():
    return redirect(url_for("home"))
#run this app
if __name__ == "__main__":
    app.run(debug=True)