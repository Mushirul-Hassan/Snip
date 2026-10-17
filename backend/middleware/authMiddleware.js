import jwt from "jsonwebtoken";
export const verify = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(/\s+/)[1];
  if (!token || !token[0] == "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Header is incorrect" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
