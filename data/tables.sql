DROP TABLE IF EXISTS scores CASCADE;

CREATE TABLE scores (
    id       SERIAL PRIMARY KEY     NOT NULL,
    user_name    VARCHAR(200)           NOT NULL,
    game_type VARCHAR(200)           NOT NULL,
    score INTEGER
);

INSERT INTO scores (user_name, game_type, score) VALUES ('unknown', 'time_easy', 0);
INSERT INTO scores (user_name, game_type, score) VALUES ('unknown', 'time_medium', 0);
INSERT INTO scores (user_name, game_type, score) VALUES ('unknown', 'time_hard', 0);
INSERT INTO scores (user_name, game_type) VALUES ('unknown', 'no_time_easy');
INSERT INTO scores (user_name, game_type) VALUES ('unknown', 'no_time_medium');
INSERT INTO scores (user_name, game_type) VALUES ('unknown', 'no_time_hard');
