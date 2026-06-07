import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Plus, Edit, Trash2 } from "lucide-react";

interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export default function SuperAdminPrivileges() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Admin",
      description: "Full access to nursery management",
      permissions: [
        { id: 1, name: "view_staff", description: "View staff", category: "Staff" },
        { id: 2, name: "manage_staff", description: "Create/Edit staff", category: "Staff" },
        { id: 3, name: "delete_staff", description: "Delete staff", category: "Staff" },
      ],
    },
    {
      id: 2,
      name: "Staff",
      description: "Limited access to daily operations",
      permissions: [
        { id: 1, name: "view_staff", description: "View staff", category: "Staff" },
        { id: 4, name: "view_children", description: "View children", category: "Children" },
      ],
    },
    {
      id: 3,
      name: "Parent",
      description: "View only access to child information",
      permissions: [
        { id: 4, name: "view_children", description: "View children", category: "Children" },
      ],
    },
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Global Privileges</h1>
            <p className="text-sm text-gray-500">Manage roles and permissions for all nurseries</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          New Role
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedRole?.id === role.id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">{role.name}</div>
                  <div className="text-sm text-gray-500">{role.permissions.length} permissions</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Permissions Details */}
        {selectedRole && (
          <div className="col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedRole.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{selectedRole.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Assigned Permissions</h3>
                  <div className="space-y-2">
                    {selectedRole.permissions.map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{perm.description}</div>
                          <div className="text-xs text-gray-500">{perm.category}</div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { id: 5, name: "manage_children", description: "Create/Edit children", category: "Children" },
                    { id: 6, name: "delete_children", description: "Delete children", category: "Children" },
                    { id: 7, name: "view_rooms", description: "View rooms", category: "Rooms" },
                    { id: 8, name: "manage_rooms", description: "Create/Edit rooms", category: "Rooms" },
                  ].map((perm) => (
                    <div key={perm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{perm.description}</div>
                        <div className="text-xs text-gray-500">{perm.category}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
