const response = (statusCode, status, data, message, res) => {
    res.status(statusCode).json({
        payload: {
            message,
            status,
            details: {
                data
            }
        }
    })
}

export default response