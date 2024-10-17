const faunadb = require('faunadb');
const q = faunadb.query;
const jwt = require('jsonwebtoken');

const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
});

exports.handler = async (event) => {
    const { username, password } = JSON.parse(event.body);

    try {
        const user = await client.query(
            q.Get(q.Match(q.Index('user_by_username'), username))
        );

        if (user.data.password === password) {
            const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, token }),
            };
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: error.message }),
        };
    }
};
