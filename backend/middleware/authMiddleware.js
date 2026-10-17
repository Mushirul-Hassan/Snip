import jwt from "jsonwebtoken";
export const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Header is missing" });
  }
  const split = authHeader.split(/\s+/);
  const token = split[1];
  if (!token || split[0] !== "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Header is incorrect" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token." });
  }
};
