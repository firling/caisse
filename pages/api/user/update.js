import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt"

export default async function handle(req, res) {
  if (req.method === "PUT") {
    await handlePUT(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

// POST /api/user
async function handlePUT(res, req) {
    const {userId, restoId} = req.body
    const user = await prisma.user.update({
        where: { id: userId },
        data: { selectedRestoId: restoId },
    });
    res.json(user);
}