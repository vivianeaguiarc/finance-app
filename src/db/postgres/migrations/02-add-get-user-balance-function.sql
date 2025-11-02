CREATE OR REPLACE FUNCTION get_user_balance(uid UUID)
RETURNS TABLE (
	earnings NUMERIC(10, 2),
	expenses NUMERIC(10, 2),
	investments NUMERIC(10, 2),
	balance NUMERIC(10, 2)
) AS $$
BEGIN 
	RETURN QUERY
	SELECT
		SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) ::NUMERIC(10, 2) AS earnings,
		SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) ::NUMERIC(10, 2) AS expenses,
		SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) ::NUMERIC(10, 2) AS investments,
		(SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) - 
		(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) +
		SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END))) AS balance
	FROM transactions
	WHERE user_id = get_user_balance.uid;
END; $$
	LANGUAGE plpgsql;