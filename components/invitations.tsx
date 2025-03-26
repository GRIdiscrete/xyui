import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Trash } from 'lucide-react'

interface props {
    commu: string
}

interface Invitation {
    status: string,
    user_id: string,
    updated_on: string,
    title: string
}

export function InvitationsList({ commu }: props) {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axios.get('https://accounts.protracc.com/api/memberInvitation', {
          headers: {
            'x-api-key': 'proTract22$'
          },
          params: { community_id: commu }
        })
        setInvitations(response.data.data as Invitation[])
      } catch (error) {
        toast.error(`${error}`)
      } finally {
        setLoading(false)
      }
    }

    fetchInvitations()
  }, [commu])

  const handleAccept = async (userId:string) => {
    try {

      // const response = await axios.get('https://accounts.protracc.com/api/acceptInvitation', {
      //   headers: {
      //     'x-api-key': 'proTract22$'
      //   },
      //   params: { community_id: commu, member_id: userId, admin:1 }
      // })
      // Replace with your actual accept API endpoint
   
      toast.success(userId)
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  const handleReject = async (userId:string) => {
    try {

      // const response = await axios.get('https://accounts.protracc.com/api/removeInvitation', {
      //   headers: {
      //     'x-api-key': 'proTract22$'
      //   },
      //   params: { community_id: commu, member_id: userId, admin:1 }
      // })
      // Replace with your actual reject API endpoint
      toast.success(userId)
    } catch (error) {
      toast.error(`${error}`)
    }
  }

  if (loading) return <div>Loading invitations...</div>

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Member Invitations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitations.length === 0 ? (
          <p className="text-muted-foreground">No pending invitations</p>
        ) : (
          invitations.map((invitation) => (
            <div
              key={invitation.user_id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{invitation.title}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>User ID: {invitation.user_id}</span>
                  <span>Status: {invitation.status}</span>
                  <span>
                    Updated: {new Date(invitation.updated_on).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAccept(invitation.user_id)}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(invitation.user_id)}
                >
                  <Trash className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}