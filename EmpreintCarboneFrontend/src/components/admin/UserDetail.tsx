import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Archive, Key, ArchiveRestore } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User } from '@/models';
import { adminService } from '@/services/adminService';

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const fetchUser = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllUsers();
      
    } catch (error) {
      toast.error("Utilisateur non trouvé");
      navigate('/user-management');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    try {
      toast.success(`Un nouveau mot de passe a été généré et envoyé à ${user.email}`);
      // Dans un environnement réel:
      // const tempPassword = await adminService.resetUserPassword(user.id);
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation du mot de passe");
    }
  };

  const handleArchiveUser = async () => {
    if (!user) return;
    const actionVerb = user.isArchived ? "restaurer" : "archiver";
    if (window.confirm(`Êtes-vous sûr de vouloir ${actionVerb} l'utilisateur ${user.username} ?`)) {
      try {
        if (user.isArchived) {
          await adminService.unarchiveUser(user.id);
        } else {
          await adminService.archiveUser(user.id);
        }
        toast.success(`L'utilisateur ${user.username} a été ${user.isArchived ? "restauré" : "archivé"}`);
        fetchUser(user.id);
      } catch (error) {
        toast.error(`Erreur lors de l'${actionVerb} de l'utilisateur ${user.username}`);
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des détails...</div>;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utilisateur non trouvé</CardTitle>
          <CardDescription>L'utilisateur demandé n'existe pas ou a été supprimé</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link to="/user-management">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste des utilisateurs
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Détails de l'utilisateur</CardTitle>
            <CardDescription>Informations détaillées sur {user.username}</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/user-management">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center">
            <h3 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h3>
            <Badge variant={user.role === "admin" ? "default" : "outline"} className="ml-3">
              {user.role === "admin" ? "Administrateur" : "Utilisateur"}
            </Badge>
            <Badge variant={user.isFirstLogin ? "destructive" : "secondary"} className="ml-2">
              {user.isFirstLogin ? "À activer" : "Actif"}
            </Badge>
            {user.isArchived && (
              <Badge variant="destructive" className="ml-2">
                Archivé
              </Badge>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Informations personnelles</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Prénom:</dt>
                  <dd>{user.firstName || '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Nom:</dt>
                  <dd>{user.lastName || '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Nom d'utilisateur:</dt>
                  <dd>{user.username}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Email:</dt>
                  <dd>{user.email}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Informations professionnelles</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Entreprise:</dt>
                  <dd>{user.company}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">ID:</dt>
                  <dd className="text-muted-foreground">{user.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Statut du compte:</dt>
                  <dd>{user.isFirstLogin ? "À activer" : "Actif"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Statut d'archive:</dt>
                  <dd>{user.isArchived ? "Archivé" : "Non archivé"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant={user.isArchived ? "default" : "destructive"}
            onClick={handleArchiveUser}
          >
            {user.isArchived ? (
              <>
                <ArchiveRestore className="mr-2 h-4 w-4" />
                Restaurer
              </>
            ) : (
              <>
                <Archive className="mr-2 h-4 w-4" />
                Archiver
              </>
            )}
          </Button>
          {!user.isArchived && (
            <Button variant="outline" onClick={handleResetPassword}>
              <Key className="mr-2 h-4 w-4" />
              Réinitialiser le mot de passe
            </Button>
          )}
        </div>
        {!user.isArchived && (
          <Button asChild>
            <Link to={`/user-management/edit/${user.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserDetail;
