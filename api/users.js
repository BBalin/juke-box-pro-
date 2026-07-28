import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByUsername } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import bcrypt from "bcrypt";

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await createUser(username, password);
      console.log("USER CREATED", user);
      const token = createToken({ id: user.id });
      console.log("CREATE TOKEN?", token);
      res.status(201).send(token);
    } catch (error) {
      console.error("REGISTER ROUTE ERROR", error);
      res.status(500).send("bebug error");
    }
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Invalid username or password.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Invalid username or password.");

    const token = createToken({ id: user.id });
    res.status(200).send(token);
  },
);
