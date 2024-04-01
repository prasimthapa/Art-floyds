"use client"

import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export function Bio({ bio, canEdit = false }: { bio: string, canEdit?: boolean }) {
  const [isEditing, setIsEditing] = useState(false)
  const [userBio, setUserBio] = useState(bio)

  const bioMutation = api.user.updateBio.useMutation()

  useEffect(() => {
    if (!isEditing && bio !== userBio) {
      bioMutation.mutate(userBio)
    }
  }, [isEditing, userBio, bio, bioMutation]);

  return <div className="px-8 py-4 text-xl text-black dark:text-white font-semibold flex flex-row space-x-2 justify-center items-center">
    {
      isEditing ?
        <Input defaultValue={userBio} onChange={e => setUserBio(e.target.value)} /> :
        <h1>{userBio}</h1>
    }
    <Button variant="ghost" onClick={() => setIsEditing(e => !e)}>
      {canEdit && isEditing ? <IconDeviceFloppy /> : <IconEdit />}
    </Button>
  </div>
}
