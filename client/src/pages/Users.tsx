import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, Plus, Eye, EyeOff } from "lucide-react";

type UserRole = "admin" | "staff" | "parent";

interface FormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export default function Users() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "", role: "staff" });

  const { data: users, isLoading, refetch } = trpc.users.list.useQuery();

  const createMutation = trpc.users.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      console.log("User created successfully");
    },
  });

  const updateMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsOpen(false);
      console.log("User updated successfully");
    },
  });

  const deleteMutation = trpc.users.delete.useMutation({
    onSuccess: () => {
      refetch();
      console.log("User deleted successfully");
    },
  });

  const handleOpenDialog = (userData?: any) => {
    if (userData) {
      setEditingId(userData.id);
      setFormData({ name: userData.name || "", email: userData.email || "", password: "", role: userData.role || "staff" });
    } else {
      setEditingId(null);
      setFormData({ name: "", email: "", password: "", role: "staff" });
    }
    setShowPassword(false);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert("Name and email are required");
      return;
    }

    if (!editingId && !formData.password) {
      alert("Password is required for new users");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
      } else {
        await createMutation.mutateAsync({ openId: `user_${Date.now()}`, ...formData });
      }
    } catch (error) {
      alert("Failed to save user");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteMutation.mutateAsync({ id });
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their roles</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={20} /> Add User
        </Button>
      </div>

      <div className="card-elegant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  Loading users...
                </td>
              </tr>
            ) : users && users.length > 0 ? (
              users.map((u: any) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === "admin" ? "bg-red-100 text-red-800" :
                      u.role === "staff" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(u)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(u.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter user name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                type="email"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password {!editingId && <span className="text-red-500">*</span>}</label>
              <div className="relative mt-1">
                <Input
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!editingId && formData.password && (
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be 8+ characters with uppercase, lowercase, and number
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
