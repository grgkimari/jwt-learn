import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./Models/UserModel.js";
import jwt from "jsonwebtoken";

dotenv.config();
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "P5eud0R@ndomSecret4454513641584";

export const registerUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    email: req.body.email,
    password: hashedPassword,
  });
  await newUser
    .save()

    .catch((error) => console.log(`Error at user registration : ${error}`));
  res.status(201).send("User created successfully.");
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  }).catch((err) => {
    return res.send("User not found.");
  });
  console.log(`User : ${JSON.stringify(user)}`);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user.email, accessTokenSecret);
      res.cookie(`AccessToken`, accessToken, {
        maxAge: 3600,
      });
      return res.send("Loggedin successfully.");
    } else {
      return res.send(`Wrong password.`).status(400);
    }
  } else {
    res.send("User not found.").status(400);
  }
};

export const authenticate = async (req, res, next) => {
  let accessTokenCookie;

  if (req.headers[`authorization`]) {
    accessTokenCookie = req.headers[`authorization`]
      .replace("Bearer", "")
      .trim();

    let email;
    try {
      email = jwt.verify(accessTokenCookie, accessTokenSecret);
      if (email) {
        req.authenticated = true;

        req.userEmail = email;
        next();
      } else {
        return res.send("Not authorized.").status(403);
      }
    } catch (err) {
      res.clearCookie("accesstoken");
      return res.redirect("/");
    }
  } else {
    return res.status(400).send("Please log in again.");
  }
};

export const getProfileInfo = async (req, res) => {
  if (req.authenticated === true && req.userEmail) {
    let user = await User.findOne({
      email: req.userEmail,
    });
    return res.status(200).json(
      JSON.stringify({
        id: user._id,
        email: user.email,
      })
    );
  } else {
    return res.status(400).send("Error validating user. Please log in.");
  }
};
