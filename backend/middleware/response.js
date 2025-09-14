function success(res, message, data) {
  return res.json({ success: true, message, data });
}

function error(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message });
}

// express error handler
function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ success:false, message: 'Internal server error' });
}

module.exports = { success, error, errorHandler };
