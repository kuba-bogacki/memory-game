from flask import Flask, render_template, jsonify, request
import data_manager


app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/api/all_scores')
def api_all_scores():
    return jsonify(data_manager.get_all_scores())


@app.route('/api/score_update', methods=['PUT'])
def api_update_score():
    score = request.get_json()
    data_manager.update_score(score)
    return 'changed'


if __name__ == "__main__":
    app.run(debug=True, port=5000)
