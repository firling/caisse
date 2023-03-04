import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt"
import { omit } from "lodash";

export default async function handle(
  req,
  res,
) {
  if (req.method === "POST") {
    await handlePOST(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

const isSamePass = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}

// POST /api/user
async function handlePOST(res, req) {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
    },
  });
  if (user && await isSamePass(req.body.password, user.password)) {
    res.json(omit(user, "password"));
  } else {
    res.status(400).end("Invalid credentials");
  }
}