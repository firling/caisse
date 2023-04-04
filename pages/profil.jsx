import CreateRestoModal from "@/components/modal/CreateRestoModal";
import { Button, Select } from "@mantine/core"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react";

export default function Profil() {
  const { data: session } = useSession()

  const [restos, setRestos] = useState([]);
  const [createResto, setCreateResto] = useState(false);

  const [users, setUsers] = useState([]);

  const getRestos = () => {
    fetch(`/api/resto?userId=${session.user.id}`)
    .then(res => res.json())
    .then(setRestos)
  }

  const getUsers = () => {
    fetch(`/api/resto/user?restoId=${session.user.selectedResto.id}`)
    .then(res => res.json())
    .then(setUsers)
  }

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  useEffect(() => {
    if (!session?.user) return;
    getRestos()
    getUsers()
  }, [session?.user])

  const changeResto = (restoId) => {
    if (restoId === session?.user.selectedResto.id) return;
    if (restoId === "new") return setCreateResto(true);


    fetch(`/api/user/update`, {
        method: "PUT",

        body: JSON.stringify({
          userId: session?.user.id,
          restoId
        }),
 
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(reloadSession);
  }

  return (
    <div className="container mx-auto mt-4 pb-16 px-4">
      <h2 className="text-xl">Bonjour, <span className="font-bold">{session?.user?.name}</span></h2>

      <Select
        mt="md"
        label="Restorant sélectionné"
        placeholder="Choisissez"
        value={session?.user.selectedResto?.id}
        data={[
          ...restos.map(elt => ({
            value: elt.resto.id, label: elt.resto.name
          })),
          {value: "new", label: "+ Nouveau Restorant"}
        ]}
        onChange={changeResto}
      />

      {session?.user?.selectedResto.role === "superAdmin" && (<>
        <h3 className="mt-4 text-lg">Administrer votre restaurant</h3>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-6 py-3">
                          Nom
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Rôle
                      </th>
                  </tr>
              </thead>
              <tbody>
                {users.map(elt => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {elt.user.name}
                      </th>
                      <td className="px-6 py-4">
                        {elt.role}
                      </td>
                  </tr>
                ))}
              </tbody>
          </table>
      </div>

      </>)}

      <Button mt="lg" fullWidth variant="outline" color="gray" onClick={signOut}>
        Déconnectez vous
      </Button>

      <CreateRestoModal 
        opened={createResto} 
        onClose={() => setCreateResto(false)}
        refresh={reloadSession}
        userId={session?.user?.id}
      />
    </div>
  )
}
