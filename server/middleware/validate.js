module.exports = (schema, source = 'body') => (req, res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};
