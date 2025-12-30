from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask Backend!")

@app.route('/')
def home():
    return "Flask Backend is Running!"

if __name__ == '__main__':
    app.run()
