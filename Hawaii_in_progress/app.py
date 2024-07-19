from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>Home Page would be here</h1>'

@app.route('/live')
def live():
    return render_template('index.html')

@app.route('/restaurant')
def restaurant():
    return render_template('map_test_index.html')

if __name__ == '__main__':
    app.run(debug=True)