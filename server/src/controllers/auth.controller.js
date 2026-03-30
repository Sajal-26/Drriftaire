const jwt = require("jsonwebtoken");
const { verifyGoogleToken } = require("../services/googleAuth.service");

const users = [];

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);
    const { sub, email, name, picture } = payload;
    let user = users.find((u) => u.googleId === sub);

    if (!user) {
      user = {
        id: users.length + 1,
        googleId: sub,
        email,
        name,
        picture,
      };
      users.push(user);
    }

    const appToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token: appToken, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

module.exports = { googleAuth };