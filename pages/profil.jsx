import CreateRestoModal from "@/components/modal/CreateRestoModal";
import { ActionIcon, Button, Select, TextInput } from "@mantine/core"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react";
import { notifications } from '@mantine/notifications';
import { IconSearch, IconUserPlus } from "@tabler/icons-react";

export default function Profil() {
  const { data: session } = useSession()
  const searchRef = useRef(null); 

  const [restos, setRestos] = useState([]);
  const [createResto, setCreateResto] = useState(false);

  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const [selfInvitations, setSelfInvitations] = useState([])

  const getRestos = () => {
    fetch(`/api/resto?userId=${session.user.id}`)
    .then(res => res.json())
    .then(setRestos)
  }

  const getUsers = () => {
    fetch(`/api/resto/user?restoId=${session.user.selectedResto.id}`)
    .then(res => res.json())
    .then(json => {
      setUsers(json.users)
      setInvitations(json.invitations)
    })
  }

  const getInvitations = () => {
    fetch(`/api/resto/invitation?userId=${session.user.id}`)
    .then(res => res.json())
    .then(setSelfInvitations)
  }

  const inviteUser = () => {
    const userMail = searchRef.current.value;
    fetch(`/api/resto/user`, {
        method: "POST",

        body: JSON.stringify({
          userMail,
          restoId: session.user.selectedResto.id
        }),
 
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        }

        if (response.status === 403) {
          notifications.show({
            color: "red",
            title: 'Utilisateur non trouvé',
            message: `l'utilisateur existe déjà.`,
          })
        } else {
          notifications.show({
            color: "red",
            title: 'Utilisateur non trouvé',
            message: `l'utilisateur n'a pas été trouvé.`,
          })
        }
        
        throw new Error("HTTP status " + response.status);
    })
    .then((res) => {
      notifications.show({
        color: "green",
        title: 'Utilisateur invité !',
        message: `l'utilisateur ${res.user.name} à bien été invité.`,
      })
      getUsers()
    })
    .catch(err => {
      console.log(err)
    })
  }

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  useEffect(() => {
    if (!session?.user) return;
    getRestos()
    getInvitations()
    
    if (!session?.user?.selectedResto) return;
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

  const editInvite = (invitId, status) => {
    fetch(`/api/resto/invitation`, {
        method: "PUT",

        body: JSON.stringify({
          invitId,
          status
        }),
 
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(() => {
      getInvitations()
      reloadSession()
    });
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

      {selfInvitations.length > 0 && (<>
        <h3 className="mt-4 text-lg">Invitation en attente</h3>
        {selfInvitations.map(elt => (
          <div key={elt.id} className="border-b p-2 flex flex-row justify-between">
            <div>{elt.resto.name}</div>
            <div>
              <a onClick={() => editInvite(elt.id, "accepted")} className="font-medium text-green-600 hover:underline">Accepter</a>
              <div className="inline mx-1">/</div> 
              <a onClick={() => editInvite(elt.id, "refused")} className="font-medium text-red-600 hover:underline">Refuser</a>
            </div>
          </div>
        ))}
      </>)}

      {session?.user?.selectedResto?.role === "superAdmin" && (<>
        <h3 className="mt-4 text-lg">Administrer votre restaurant</h3>

        <TextInput
          ref={searchRef}
          icon={<IconSearch size="1.1rem" stroke={1.5} />}
          radius="xl"
          size="md"
          rightSection={
            <ActionIcon onClick={inviteUser} size={32} radius="xl" color="primary" variant="outline">
              <IconUserPlus size="1.1rem" stroke={1.5} />
            </ActionIcon>
          }
          placeholder="Ajouter un utilisateur (mail)"
          rightSectionWidth={42}
        />

        <div className="mt-2 relative overflow-x-auto">
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
                {invitations.filter(elt => elt.status === "pending").map(elt => (
                  <tr key={elt.referred.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {elt.referred.name}
                      </th>
                      <td className="px-6 py-4 text-amber-500">
                        {elt.status}
                      </td>
                  </tr>
                ))}
                {users.map(elt => (
                  <tr key={elt.user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
