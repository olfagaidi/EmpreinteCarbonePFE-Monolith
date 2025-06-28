import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User, Camera, Building, Calendar, Phone, Briefcase, MapPin, UserCheck
} from "lucide-react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileService } from "@/services/profileService";
import api from "@/services/api";

const accountSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  birthDate: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  manager: z.string().optional(),
  employeeId: z.string().optional(),
  hireDate: z.string().optional(),
  photo: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;
export type { AccountFormValues };

const AccountSettings = () => {
  const { authState, updateAuthState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      birthDate: "",
      jobTitle: "",
      department: "",
      location: "",
      manager: "",
      employeeId: "",
      hireDate: "",
      photo: "",
    },
  });

  // 🔁 Recharger les données utilisateur depuis l’API au chargement de la page
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await profileService.getCurrentUser();
        updateAuthState(user); // met à jour le contexte global
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Mettre à jour les champs du formulaire quand authState.user est prêt
  useEffect(() => {
    if (authState.user) {
      form.reset({
        firstName: authState.user.firstName || "",
        lastName: authState.user.lastName || "",
        phone: authState.user.phone || "",
        birthDate: authState.user.birthDate
        ? new Date(authState.user.birthDate).toISOString().split("T")[0]
        : "",
        jobTitle: authState.user.jobTitle || "",
        department: authState.user.department || "",
        location: authState.user.location || "",
        manager: authState.user.manager || "",
        employeeId: authState.user.employeeId || "",
        hireDate: authState.user.hireDate
    ? new Date(authState.user.hireDate).toISOString().split("T")[0]
    : "",
    photo: authState.user.Photo ,
      });
    }
  }, [authState.user]);

  const onSubmit = async (data: AccountFormValues) => {
    try {
      await profileService.updateProfile(data);
      const updatedUser = await profileService.getCurrentUser();
      updateAuthState(updatedUser); // met à jour authState et déclenche reset()
      toast.success("Profil mis à jour !");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };



const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};


// Après tous les useEffect et const
const fileInputRef = useRef<HTMLInputElement>(null);
const handleAvatarClick = () => fileInputRef.current?.click();

// ⬇️ COPIE-COLLE cette version AVANT le return()
const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
 const file = event.target.files?.[0];
if (!file) return;

const reader = new FileReader();
reader.onloadend = async () => {
  const base64 = reader.result?.toString();
  if (!base64) {
    toast.error("Erreur de lecture de l’image");
    return;
  }

  const imageFile = base64ToFile(base64, file.name); // ✅ convert base64 to File

  try {
    const existingData = form.getValues();
    const formData = new FormData();

    Object.entries(existingData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    formData.append("Photo", imageFile); // ✅ now this is a real file

    await api.put("/Auth/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updatedUser = await profileService.getCurrentUser();
    updateAuthState(updatedUser);
    toast.success("Photo mise à jour !");
  } catch (err) {
    toast.error("Erreur lors de l’envoi de la photo");
    console.error(err);
  }
};

reader.readAsDataURL(file); // This remains the same

};




  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres du compte</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
        </div>

       <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Camera className="h-5 w-5" />
      Photo de profil
    </CardTitle>
    <CardDescription>
      Votre photo apparaîtra dans l'application
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-6">
      {/* 🧠 Avatar avec icône caméra superposée */}
      <div className="relative">
        <Avatar className="h-24 w-24">
        <AvatarImage src={authState.user?.photo ? `data:image/jpeg;base64,${authState.user.photo}` : undefined} />

          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>

        {/* 📸 Icône caméra superposée */}
        <div
          className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 cursor-pointer hover:scale-105 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-4 w-4 text-white" />
        </div>

        {/* input invisible */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAvatarUpload}
        />
      </div>
    </div>
  </CardContent>
</Card>



        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>Vos infos de base et coordonnées</CardDescription>
              </div>
              <Button variant={isEditing ? "ghost" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Annuler" : "Modifier"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl><Input placeholder="Votre prénom" {...field} disabled={!isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl><Input placeholder="Votre nom" {...field} disabled={!isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl><Input placeholder="Votre numéro de téléphone" type="tel" {...field} disabled={!isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="birthDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl><Input placeholder="JJ/MM/AAAA" type="date" {...field} disabled={!isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Separator />

                <h3 className="text-lg font-semibold">Informations professionnelles</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="jobTitle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poste</FormLabel>
                      <FormControl><Input placeholder="Votre fonction"  {...field} disabled={!isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="department" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Département</FormLabel>
                      <FormControl><Input placeholder="Votre département" {...field} disabled={!isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation</FormLabel>
                      <FormControl><Input placeholder="Bureau/Site" {...field} disabled={!isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="manager" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager</FormLabel>
                      <FormControl><Input placeholder="Votre manager" {...field} disabled={!isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <Button type="submit" className="w-full">Enregistrer les modifications</Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations de l'entreprise
            </CardTitle>
            <CardDescription>Gérées par l'administrateur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input value={authState.user?.email || ""} readOnly className="bg-muted" />
              </div>
              <div>
                <Label>Nom d'utilisateur</Label>
                <Input value={authState.user?.username || ""} readOnly className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;
