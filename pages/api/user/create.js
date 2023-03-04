import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt"

export default async function handle(req, res) {
  if (req.method === "POST") {
    await handlePOST(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
};

// POST /api/user
async function handlePOST(res, req) {
  const user = await prisma.user.create({
    data: { ...req.body, password: await hashPassword(req.body.password) },
  });
  res.json(user);
}