import jwt from "jsonwebtoken";

const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const info = jwt.decode(token);

    if (info.role !== "admin") {
      throw new Error("only admin");
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

export default adminMiddleware;
