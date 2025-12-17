"use client";

import { useUpdateUserMutation } from "@/lib/queries/users";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditUserModalProps {
  user: {
    id: number;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({
  user,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const updateUserMutation = useUpdateUserMutation();
  const [formData, setFormData] = useState({
    name: user.name || "",
    role: user.role,
    password: "",
  });

  useEffect(() => {
    if (updateUserMutation.isSuccess && !updateUserMutation.data?.error) {
      onSuccess();
    }
  }, [updateUserMutation.isSuccess, updateUserMutation.data, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate({
      id: user.id,
      name: formData.name,
      role: formData.role,
      password: formData.password || undefined,
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Leave password blank to keep the current password.
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          <strong>Email:</strong> {user.email}
        </div>

        {updateUserMutation.data?.error && (
          <Alert variant="destructive">
            <AlertDescription>{updateUserMutation.data.error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-password">
              New Password (leave blank to keep current)
            </Label>
            <Input
              id="edit-password"
              type="password"
              minLength={6}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as "USER" | "ADMIN" })
              }
            >
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

