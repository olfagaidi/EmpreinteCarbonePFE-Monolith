import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Archive, UserPlus, ArchiveRestore, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/models";
import { adminService } from "@/services/adminService";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [archivedEmails, setArchivedEmailsState] = useState<string[]>([]);

  const navigate = useNavigate();

  const getArchivedEmails = (): string[] => {
    return JSON.parse(localStorage.getItem("archivedEmails") || "[]");
  };

  const setArchivedEmails = (emails: string[]) => {
    localStorage.setItem("archivedEmails", JSON.stringify(emails));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllUsers();
      setUsers(response);
      setArchivedEmailsState(getArchivedEmails());
    } catch (error) {
      console.error("Erreur de récupération :", error);
      toast.error("Erreur lors de la récupération des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveUser = async (
    userId: string,
    username: string,
    currentArchiveStatus: boolean,
    email: string
  ) => {
    const confirmMessage = currentArchiveStatus
      ? `Restaurer l'utilisateur ${username} ?`
      : `Archiver l'utilisateur ${username} ?`;

    if (window.confirm(confirmMessage)) {
      try {
        if (currentArchiveStatus) {
          await adminService.unarchiveUser(email);
          const updated = getArchivedEmails().filter((e) => e !== email);
          setArchivedEmails(updated);
          setArchivedEmailsState(updated);
        } else {
          await adminService.archiveUser(email);
          const updated = [...getArchivedEmails(), email];
          setArchivedEmails(updated);
          setArchivedEmailsState(updated);
        }

        toast.success(
          currentArchiveStatus
            ? `Utilisateur ${username} restauré`
            : `Utilisateur ${username} archivé`
        );
      } catch (error) {
        console.error("Erreur lors de l'archivage :", error);
        toast.error("Erreur lors de la mise à jour de l'utilisateur");
      }
    }
  };

  const handleDeleteUser = async (email: string, username: string) => {
    if (window.confirm(`Supprimer définitivement l'utilisateur ${username} ?`)) {
      try {
        await adminService.deleteUser(email);
        toast.success(`Utilisateur ${username} supprimé`);
        fetchUsers();
      } catch (error) {
        console.error("Erreur suppression :", error);
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const match =
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);

    const isArchived = archivedEmails.includes(user.email);

    return activeTab === "active"
      ? match && !isArchived
      : match && isArchived;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Gérez les utilisateurs de la plateforme
          </CardDescription>
        </div>
        {activeTab === "active" && (
          <Button asChild>
            <Link to="/user-management/add" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Ajouter un utilisateur
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "active" | "archived")}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="active">Utilisateurs</TabsTrigger>
            <TabsTrigger value="archived">Utilisateurs archivés</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-4">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">Chargement...</div>
        ) : (
          <Table>
            <TableCaption>
              {activeTab === "active"
                ? "Liste des utilisateurs actifs"
                : "Liste des utilisateurs archivés"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Aucun utilisateur {activeTab === "active" ? "actif" : "archivé"} trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const isArchived = archivedEmails.includes(user.email);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={!user.isFirstLogin ? "secondary" : "destructive"}
                        >
                          {!user.isFirstLogin ? "Actif" : "À activer"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className={isArchived ? "text-primary" : "text-destructive"}
                            onClick={() =>
                              handleArchiveUser(user.id, user.username, isArchived, user.email)
                            }
                          >
                            {isArchived ? (
                              <ArchiveRestore className="h-4 w-4" />
                            ) : (
                              <Archive className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user.email, user.username)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;