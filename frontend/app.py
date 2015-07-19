from flask import Flask, render_template
from flask.ext.triangle import Triangle
app = Flask(__name__)
Triangle(app)

@app.route('/')
def hello_world():
    return render_template('customer/index.html', )

if __name__ == '__main__':
    app.run(debug=True)
