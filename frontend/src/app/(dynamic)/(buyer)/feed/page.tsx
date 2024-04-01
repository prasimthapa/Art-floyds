import { type Event } from "~/xata";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { getServerAuthSession } from "~/server/auth";
import { AddEventButton } from "./_components/add-event-button";
import { ClockIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/server";
import { IconLocationPin } from "@tabler/icons-react";
import { Label } from "~/components/ui/label";
import { RequestInvitationButton } from "./_components/request-invitation-button";

export default async function Page() {
  const session = await getServerAuthSession()
  const events = await api.event.all.query()

  return <div className="flex flex-col space-y-3">
    <div className="flex flex-row justify-between items-start">
      <h1 className="text-lg font-semibold md:text-2xl pb-4">Events</h1>
      {
        session?.user.role === "artist" &&
        <AddEventButton />
      }
    </div>
    {events.map(e => <EventCard event={e} key={e.id} />)}
  </div>
}

function EventCard({ event }: { event: Event }) {
  const { dateTime, name, description, location } = event
  return (
    <Card className="flex flex-row">
      <CardHeader>
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <ClockIcon />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {dateTime?.toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {dateTime?.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 grid-flow-row place-items-center">
        <div className="flex flex-row space-x-6 items-center">
          <div className="flex flex-col items-start justify-center space-y-2">
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
            <div className="flex flex-row space-x-1">
              <IconLocationPin className="size-3" />
              <Label>{location}</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="flex-grow" />
      <CardFooter>
        <RequestInvitationButton {...event} />
      </CardFooter>
    </Card>
  )
}
