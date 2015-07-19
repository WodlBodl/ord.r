from flask import Flask, render_template
from flask.ext.triangle import Triangle
app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('landing_page.html')

if __name__ == '__main__':
    app.run(debug=True)
