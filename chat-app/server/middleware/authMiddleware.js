const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }
     const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token missing"
        });
    }
     console.log(token);
    console.log("Authentication Middleware Running");
    next();
};

module.exports = authMiddleware;