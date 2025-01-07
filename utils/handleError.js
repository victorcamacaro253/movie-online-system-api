const handleError = (res, error, message = 'Internal server error') => {
    console.error(error);
    res.status(500).json({ error: message });
};

export default handleError;