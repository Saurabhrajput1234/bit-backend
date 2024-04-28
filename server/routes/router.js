const express = require("express");
const router = express.Router();
const FilePairModel = require("../models/userSchema");
const authenticate = require("../middleware/authenticate");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcryptjs");
const upload = require("../middleware/upload");

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dcnblai32",
  api_key: "322754248918634",
  api_secret: "hPd5b4MA8UToPXSpFgZ4BUAFYcc",
});







// authentication

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, role } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !role
  ) {
    
    return res.status(422).json({ error: "Fill all details" });
  }

  try {
    const preuser = await FilePairModel.findOne({ email });
    if (preuser) {
      return res.status(422).json({ error: "This email already exists" });
    }

    if (password !== confirmPassword) {
      return res
        .status(422)
        .json({ error: "Password and confirm password do not match" });
    }

    const finalUser = new FilePairModel({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role, // Set role
    });

    await finalUser.save();

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});




//user Login
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "fill all the datails" });
  }
  try {
    const userValid = await FilePairModel.findOne({ email: email });
    console.log(userValid);
    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);
      if (!isMatch) {
        res.status(422).json({ error: "invalid details" });
      } else {
        // token generate
        const token = await userValid.generateAuthtoken();

        console.log("token", token);
        // cookiegenerate
        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });
        const result = {
          userValid,
          token,
        };
        res.status(201).json({ status: 201, result });
      }
    }
  } catch (error) {
    res.status(422).json(error);
  }
});






// user validation
router.get("/validuser", authenticate, async (req, res) => {
  console.log("hellll",req.userId );
  try {
    const validUserOne = await FilePairModel.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, validUserOne });
    console.log("hellll",validUserOne);
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});







module.exports = router;
