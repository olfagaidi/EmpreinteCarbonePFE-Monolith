import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { InfoIcon, MailIcon } from 'lucide-react';

// Form schema with validation
const formSchema = z.object({
  username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
  email: z.string().email({ message: "L'email n'est pas valide" }),
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  company: z.string().min(2, { message: "Le nom de l'entreprise doit contenir au moins 2 caractères" }),
  role: z.enum(['admin', 'user']),
  sendEmail: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

const UserRegistration: React.FC = () => {
  const { register } = useAuth();
  const { userId } = useParams();
  const isEditMode = !!userId;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      company: 'TraLIS',
      role: 'user',
      sendEmail: true
    }
  });

  useEffect(() => {
    if (isEditMode) {
      fetchUser(userId!);
    }
  }, [userId]);

  const fetchUser = async (id: string) => {
    try {
      const user = await fetch(`/api/Auth/users/${id}`).then(res => res.json()); // remplacer par ton service réel
      form.reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        sendEmail: false
      });
    } catch (error) {
      toast.error("Utilisateur non trouvé.");
      navigate('/user-management');
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await fetch(`/api/Auth/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, name: `${data.username} `.trim() })
        });
        toast.success(`Utilisateur ${data.username} mis à jour avec succès.`);
      } else {
        await register({
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
          role: data.role
        });
        toast.success(`L'utilisateur ${data.username}  a été créé avec succès.`);
      }
      navigate('/user-management');
    } catch (error) {
      toast.error(`Erreur lors de la ${isEditMode ? "mise à jour" : "création"} de l'utilisateur.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditMode ? "Modifier un utilisateur" : "Créer un nouvel utilisateur"}</CardTitle>
          <CardDescription>{isEditMode ? "Modifier les informations d'un utilisateur existant." : "Ajoutez un nouvel utilisateur à la plateforme TraLIS Empreinte Carbone."}</CardDescription>
        </CardHeader>
        <CardContent>
          {registrationSuccess && !isEditMode && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <InfoIcon className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                L'utilisateur a été créé avec succès. Un email d'invitation a été envoyé à l'adresse fournie.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl><Input placeholder="Prénom" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl><Input placeholder="Nom" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl><Input placeholder="Nom d'utilisateur" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="email@tralis.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entreprise</FormLabel>
                    <FormControl><Input placeholder="Nom de l'entreprise" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                
              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="sendEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Envoyer un email d'invitation</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          L'utilisateur recevra un email avec un lien pour définir son mot de passe.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start space-x-2">
                <MailIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Un mot de passe temporaire sera généré automatiquement. L'utilisateur devra le changer lors de sa première connexion.
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (isEditMode ? "Mise à jour en cours..." : "Création en cours...") : (isEditMode ? "Mettre à jour l'utilisateur" : "Créer l'utilisateur")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegistration;
