import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { adminActions } from "@/store/slices/adminSlice";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Loader2, MailCheck, MailX, UserX, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { AdminUser } from "@/store/slices/adminSlice";

const LIMIT = 15;

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users, usersPagination, usersLoading, actionLoading } =
    useAppSelector((s) => s.admin);

  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [confirm, setConfirm]   = useState<AdminUser | null>(null);

  useEffect(() => {
    dispatch(adminActions.fetchUsersRequest({ page, limit: LIMIT }));
  }, [page, dispatch]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBlock = () => {
    if (!confirm) return;
    dispatch(
      adminActions.blockUserRequest({
        id: confirm._id,
        isBlocked: !confirm.isBlocked,
      })
    );
    setConfirm(null);
  };

  const totalPages = usersPagination?.pages ?? 1;

  return (
    <div className="p-6 lg:p-8">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {usersPagination?.total ?? 0} total registered users
          </p>
        </div>
      </div>

      <Card className="card-premium">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {usersLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          u.role === "admin"
                            ? "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-900/20"
                            : ""
                        }
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <span className="flex items-center gap-1.5">
                        {u.isEmailVerified ? (
                          <MailCheck className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <MailX className="h-3.5 w-3.5 text-rose-400" />
                        )}
                        {u.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          u.isEmailVerified
                            ? "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-amber-400 text-amber-600 bg-amber-50"
                        }
                      >
                        {u.isEmailVerified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          u.isBlocked
                            ? "border-rose-400 text-rose-600 bg-rose-50 dark:bg-rose-900/20"
                            : "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                        }
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirm(u)}
                        disabled={actionLoading}
                        className={
                          u.isBlocked
                            ? "border-emerald-400 text-emerald-600 hover:bg-emerald-50"
                            : "border-rose-400 text-rose-600 hover:bg-rose-50"
                        }
                      >
                        {u.isBlocked ? (
                          <><UserCheck className="h-3.5 w-3.5 mr-1" /> Unblock</>
                        ) : (
                          <><UserX className="h-3.5 w-3.5 mr-1" /> Block</>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <AlertDialog open={!!confirm} onOpenChange={(v) => !v && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.isBlocked ? "Unblock User?" : "Block User?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.isBlocked
                ? `${confirm?.name} will regain full access to the platform.`
                : `${confirm?.name} will lose access to the platform immediately.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleBlock}
              className={confirm?.isBlocked ? "" : "bg-destructive hover:bg-destructive/90"}
            >
              {confirm?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
    </div>
  );
};

export default AdminUsers;