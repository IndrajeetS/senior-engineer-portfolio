import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Clock, Mail, Trash2, User } from "lucide-react";
import {
  useDeleteEnquiry,
  useGetEnquiries
} from "../api/admin.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Enquiries() {
  const { data: enquiries = [], isLoading } = useGetEnquiries();

  const { mutate: deleteEnquiry } = useDeleteEnquiry();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Contact Enquiries</h2>
        <p className="text-muted-foreground">Messages from your portfolio contact form.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Received At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">Loading messages...</TableCell>
                </TableRow>
              ) : enquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">No enquiries yet.</TableCell>
                </TableRow>
              ) : enquiries.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 font-medium">
                        <User size={14} className="text-primary" />
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail size={12} />
                        {item.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-md text-sm whitespace-pre-wrap">{item.message}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this enquiry from your database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteEnquiry(item._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
