const faunadb = require('faunadb');
const q = faunadb.query;

// Initialize FaunaDB client
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET, // Your FaunaDB secret from environment variables
});

exports.handler = async (event) => {
  // Parse the incoming request body
  const { title, code } = JSON.parse(event.body);

  try {
    // Create a new post in FaunaDB
    const result = await client.query(
      q.Create(q.Collection('posts'), {
        data: { title, code },
      })
    );

    // Return a success response with the created post data
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, post: result.data }),
    };
  } catch (error) {
    // Handle errors and return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

