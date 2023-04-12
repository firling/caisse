import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  if (req.method === "GET") {
    await handleGET(res, req);
  } if(req.method === "PUT") {
    await handlePUT(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

async function handleGET(res, req) {
    const {userId} = req.query

    const invitations = await prisma.invitation.findMany({
        where: {
          referredId: userId,
          status: "pending"
        },
        include: {
            resto: true
        }
    })

    res.json(invitations);
}

async function handlePUT(res, req) {
  const {invitId, status} = req.body

  const invit = await prisma.invitation.update({
    where: { id: invitId },
    data: {
      status
    }
  })

  if (status === "accepted") {
    await prisma.userResto.create({
        data: {
            userId: invit.referredId,
            restoId: invit.restoId,
            role: "waiter"
        }
    })

    await prisma.user.update({
      where: {id: invit.referredId},
      data: {
        selectedRestoId: invit.restoId
      }
    })
  }

  res.json({
    status: "success"
  })
}