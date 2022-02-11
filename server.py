from flask import Flask, render_template, jsonify
import data_manager


app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/api/all_scores')
def api_all_scores():
    return jsonify(data_manager.get_all_scores())


if __name__ == "__main__":
    app.run(debug=True, port=5000)
