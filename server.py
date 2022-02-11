from flask import Flask, render_template, jsonify, request
import data_manager


app = Flask(__name__)


@app.route('/main')
def main_page():
    return render_template('index.html')


@app.route('/game')
def game():
    return render_template('game.html')


@app.route('/scores')
def scores():
    return render_template('scores.html')


@app.route('/api/all_scores')
def api_all_scores():
    return jsonify(data_manager.get_all_scores())


@app.route('/api/score_update', methods=['PUT'])
def api_update_score():
    score = request.get_json()
    data_manager.update_score(score)
    return 'changed'


@app.route('/api/the_best_score/<game_type>')
def api_the_best_score(game_type):
    return jsonify(data_manager.get_the_best_score_for_the_game_type(game_type))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
