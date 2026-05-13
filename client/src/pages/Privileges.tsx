import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Plus, Shield } from "lucide-react";

interface RoleWithPermissions {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  { id: "view_dashboard", label: "View Dashboard", category: "Dashboard" },
  { id: "view_staff", label: "View Staff", category: "Staff" },
  { id: "manage_staff", label: "Manage Staff", category: "Staff" },
  { id: "view_children", label: "View Children", category: "Children" },
  { id: "manage_children", label: "Manage Children", category: "Children" },
  { id: "view_parents", label: "View Parents", category: "Parents" },
  { id: "manage_parents", label: "Manage Parents", category: "Parents" },
  { id: "view_rooms", label: "View Rooms", category: "Rooms" },
  { id: "manage_rooms", label: "Manage Rooms", category: "Rooms" },
  { id: "view_activities", label: "View Activities", category: "Activities" },
  { id: "manage_activities", label: "Manage Activities", category: "Activities" },
  { id: "view_checkin", label: "View Check-in/Out", category: "Check-in/Out" },
  { id: "manage_checkin", label: "Manage Check-in/Out", category: "Check-in/Out" },
  { id: "view_payments", label: "View Payments", category: "Payments" },
  { id: "manage_payments", label: "Manage Payments", category: "Payments" },
  { id: "view_photos", label: "View Photos", category: "Photos" },
  { id: "manage_photos", label: "Manage Photos", category: "Photos" },
  { id: "view_reports", label: "View Reports", category: "Reports" },
  { id: "manage_users", label: "Manage Users", category: "Admin" },
  { id: "manage_privileges", label: "Manage Privileges", category: "Admin" },
];

export default function Privileges() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", permissions: [] as string[] });

  const { data: roles, isLoading, refetch } = trpc.users.list.useQuery();

  const handleOpenDialog = (roleData?: any) => {
    if (roleData) {
      setEditingId(roleData.id);
      setFormData({ name: roleData.name || "", description: roleData.description || "", permissions: roleData.permissions || [] });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "", permissions: [] });
    }
    setIsOpen(true);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("Role name is required");
      return;
    }
    console.log("Saving role:", formData);
    setIsOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      console.log("Deleting role:", id);
    }
  };

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PERMISSIONS>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Privileges & Roles Management</h1>
          <p className="text-muted-foreground mt-1">Manage roles and assign permissions to users</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={20} /> Add Role
        </Button>
      </div>

      {/* Roles Table */}
      <div className="card-elegant overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/50">
          <h2 className="font-semibold text-foreground">Roles</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Permissions</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  Loading roles...
                </td>
              </tr>
            ) : (
              <>
                {/* Admin Role */}
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">Admin</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Full system access</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      All Permissions
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog({ id: 1, name: "Admin", description: "Full system access", permissions: AVAILABLE_PERMISSIONS.map((p) => p.id) })} className="h-7 w-7 p-0">
                      <Edit2 size={16} />
                    </Button>
                  </td>
                </tr>

                {/* Staff Role */}
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">Staff</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Staff member access</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      12 Permissions
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog({ id: 2, name: "Staff", description: "Staff member access", permissions: ["view_dashboard", "view_children", "view_staff", "manage_checkin"] })} className="h-7 w-7 p-0">
                      <Edit2 size={16} />
                    </Button>
                  </td>
                </tr>

                {/* Parent Role */}
                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">Parent</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">Parent/Guardian access</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      5 Permissions
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog({ id: 3, name: "Parent", description: "Parent/Guardian access", permissions: ["view_dashboard", "view_children", "view_photos", "view_payments"] })} className="h-7 w-7 p-0">
                      <Edit2 size={16} />
                    </Button>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog for editing roles */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield size={24} className="text-primary" />
              {editingId ? "Edit Role" : "Add New Role"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Role Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Role Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Manager, Teacher, Assistant"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role responsibilities"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Assign Permissions</h3>
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="border border-border rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-3">{category}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {permissions.map((perm) => (
                        <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.permissions.includes(perm.id)}
                            onCheckedChange={() => handlePermissionToggle(perm.id)}
                          />
                          <span className="text-sm text-foreground">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingId ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
