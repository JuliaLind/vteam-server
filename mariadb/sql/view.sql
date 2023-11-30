DROP VIEW IF EXISTS v_user;

CREATE VIEW v_user AS
SELECT
    user.id,
    email,
    card_nr,
    card.name AS card_type,
    balance,
    `active`
FROM `user`
LEFT JOIN
    `card`
    ON user.card_type = card.id
;
