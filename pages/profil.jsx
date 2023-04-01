import CreateRestoModal from "@/components/modal/CreateRestoModal";
import { Button, Select } from "@mantine/core"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react";

export default function Profil() {
  const { data: session } = useSession()

  const [restos, setRestos] = useState([]);
  const [createResto, setCreateResto] = useState(false);

  const getRestos = () => {
    fetch(`/api/resto?userId=${session.user.id}`)
    .then(res => res.json())
    .then(setRestos)
  }

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  useEffect(() => {
    if (!session?.user) return;
    getRestos()
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
