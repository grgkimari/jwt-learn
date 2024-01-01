import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./Models/UserModel.js";
import jwt from "jsonwebtoken";

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "P5eud0R@ndomSecret4454513641584";

export const registerUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    email: req.body.email,
    password: hashedPassword,
  });
  await newUser
    .save()
    .then(() =>
      console.log(`User with email ${newUser.email} registered successfully.`)
    )
    .catch((error) => console.log(`Error at user registration : ${error}`));
  res.status(201).send("User created successfully.");
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  }).catch((err) => {
    console.log(`Error fetching user : ${err}`);
    return res.send("User not found.");
  });
  console.log(`User : ${JSON.stringify(user)}`);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      console.log(
        `User authenticated.\nAccess Token Secret = ${accessTokenSecret}`
      );
      const accessToken = jwt.sign(user.email, accessTokenSecret);
      res.cookie(`AccessToken`, accessToken, {
        maxAge : 3600
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
    let accessTokenCookie
    
    if(req.cookie && req.cookie["accesstoken"]){
accessTokenCookie = req.cookie["accesstoken"]
console.log(`Access Token Cookie : ${accessTokenCookie}`)
let email
try{
    email = jwt.verify(accessTokenCookie, accessTokenSecret)
if(email ){
    req.authenticated = true
    console.log(`Setting email : ${email}`)
    req.userEmail = email
next()
    }
    else{
        return res.send("Not authorized.").status(403)
    }


}
catch(err) {
    console.log(`Error verifying login status.`)
    res.clearCookie("accesstoken")
    return res.redirect('/')
}
    }
    else{
        return res.send("Please log in again.")
    }
}

export const getProfileInfo = async(req, res) => {
    console.log(`Getting profile info`)
    if(req.authenticated && req.email){
        let user = await User.findOne({
            email : req.email
        })
        return res.json(JSON.stringify(user)).status(200)

    }
    else{
        return res.send("Error validating user. Please log in.")
    }
}