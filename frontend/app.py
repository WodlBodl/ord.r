from flask import Flask, render_template
from flask.ext.triangle import Triangle
app = Flask(__name__)
Triangle(app)

@app.route('/')
def landing_page():
    return render_template('landing_page.html')

@app.route('/menu')
def menu():
    return render_template('customer/menu.html')


if __name__ == '__main__':
    app.run(debug=True)
