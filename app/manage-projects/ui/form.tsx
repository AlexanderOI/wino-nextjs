"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Minus, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { z } from "zod"

import { apiClient } from "@/utils/api-client"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SelectItem } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePicker } from "@/components/ui/date-picker"
import { SelectSimple } from "@/components/common/form/select-simple"
import { toast } from "@/components/ui/use-toast"

import { Project } from "@/features/project/interfaces/project.interface"
import { User } from "@/features/user/interfaces/user.interface"

const statusOptions = ["Pending", "In Progress", "Completed"]

const projectSchema = z.object({
  name: z.string().min(5),
  code: z.string().min(3),
  description: z.string().min(10),
  status: z.enum(["Pending", "In Progress", "Completed"]),
  startDate: z.date(),
  endDate: z.date(),
  leaderId: z.string().min(1, { message: "Leader is required" }),
  client: z.string().min(3, { message: "Client is required" }),
})

interface Props {
  users: User[]
  project?: Project
}

export default function FormProject({ users, project }: Props) {
  const router = useRouter()
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>(
    project?.members || []
  )

  const [searchParticipantTerm, setSearchParticipantTerm] = useState("")
  const [searchSelectedParticipantTerm, setSearchSelectedParticipantTerm] = useState("")

  const handleAddParticipant = (participant: User) => {
    setSelectedParticipants((prev) => [...prev, participant])
  }

  const handleRemoveParticipant = (participantId: string) => {
    setSelectedParticipants(selectedParticipants.filter((p) => p._id !== participantId))
  }

  const form = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      code: project?.code || "",
      description: project?.description || "",
      leaderId: project?.leaderId || "",
      status: project?.status || "Pending",
      startDate: project?.startDate ? new Date(project?.startDate) : new Date(),
      endDate: project?.endDate ? new Date(project?.endDate) : new Date(),
      client: project?.client || "",
    },
  })

  const onSubmit = form.handleSubmit(async (values: Project) => {
    try {
      let id = ""
      if (project?._id) {
        await apiClient.patch(`/projects/${project._id}`, values)
        id = project._id
      } else {
        const response = await apiClient.post("/projects", values)
        id = response.data._id
      }

      apiClient.put(`/projects/${id}/set-users-team`, {
        membersId: selectedParticipants.map((participant) => participant._id),
      })

      toast({
        title: "Project saved",
        description: "Project has been saved successfully",
        duration: 1000,
      })

      router.replace(`/manage-projects/edit/${id}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.code === "code_already_exists") {
          form.setError("code", {
            message: "Project code already exists",
          })
          return
        }
        toast({
          title: "Error",
          description: error.response?.data.message,
          duration: 1000,
        })
      }
    }
  })

  return (
    <Card className="w-full p-2">
      <CardContent className="space-y-6">
        <Form {...form}>
          <form id="project-form" onSubmit={onSubmit}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid gap-4">
                <div className="grid sm:grid-cols-4 gap-4">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Project Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Project Code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Project Code"
                            {...field}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.target.value.toLocaleUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="leaderId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Leader</FormLabel>
                        <FormControl>
                          <SelectSimple
                            name="leaderId"
                            placeholder="Select Leader"
                            label="Users"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {users.map((user) => (
                              <SelectItem key={user._id} value={user._id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectSimple>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter Project Description" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    name="client"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter Client" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <SelectSimple
                            name="status"
                            label="Status"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectSimple>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Project Dates */}
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold">Project Timeline</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  name="startDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          name="startDate"
                          selected={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="endDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          name="endDate"
                          selected={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        {/* Participants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Participants</h3>
          </div>

          {/* Selected Participants */}
          <div className="grid sm:grid-cols-2 gap-4">
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <div className="p-4 space-y-4">
                <Input
                  type="text"
                  placeholder="Search Participants"
                  className="w-full"
                  onChange={(e) => setSearchParticipantTerm(e.target.value)}
                />

                {users
                  .filter(
                    (user) =>
                      !selectedParticipants.map((p) => p._id).includes(user._id) &&
                      user.name
                        .toLowerCase()
                        .includes(searchParticipantTerm.toLowerCase())
                  )
                  .map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center justify-between gap-2"
                    >
                      <ParticipantCard participant={participant} />
                      <Button
                        key={participant._id}
                        variant="purple"
                        className="w-10 h-10 p-0"
                        onClick={() => handleAddParticipant(participant)}
                      >
                        <Plus />
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>

            {/* Search and Filter Participants */}
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <div className="p-4 space-y-4">
                <Input
                  type="text"
                  placeholder="Search Participants"
                  className="w-full"
                  onChange={(e) => setSearchSelectedParticipantTerm(e.target.value)}
                />

                {selectedParticipants
                  .filter((participant) =>
                    participant.name
                      .toLowerCase()
                      .includes(searchSelectedParticipantTerm.toLowerCase())
                  )
                  .map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center justify-between gap-2"
                    >
                      <ParticipantCard participant={participant} />
                      <Button
                        key={participant._id}
                        variant="purple"
                        className="w-10 h-10 p-0"
                        onClick={() => handleRemoveParticipant(participant._id)}
                      >
                        <Minus />
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button type="submit" form="project-form">
          Save Project
        </Button>
      </CardFooter>
    </Card>
  )
}

const ParticipantCard = ({ participant }: { participant: User }) => {
  return (
    <div key={participant._id} className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`${participant.avatar ?? ""}`} />

          <AvatarFallback>{participant.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{participant.name}</p>
          <p className="text-sm text-muted-foreground">{participant.email}</p>
        </div>
      </div>
    </div>
  )
}
