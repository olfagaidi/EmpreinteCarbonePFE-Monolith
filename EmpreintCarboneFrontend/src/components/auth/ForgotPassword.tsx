
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MailIcon, ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

const emailSchema = z.object({
  email: z.string().email({ message: "L'email n'est pas valide" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const ForgotPassword: React.FC = () => {
  const { sendResetPasswordLink } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await sendResetPasswordLink(data.email);
      if (success) {
        setEmailSent(true);
        setSentEmail(data.email);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi du lien de réinitialisation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-center">Email envoyé</CardTitle>
              <CardDescription className="text-center">
                Un lien de réinitialisation a été envoyé à {sentEmail}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-4">
                Veuillez vérifier votre boîte de réception et cliquer sur le lien contenu dans l'email pour réinitialiser votre mot de passe.
              </p>
              <p className="text-center text-sm">
                Si vous ne recevez pas l'email, vérifiez votre dossier spam ou essayez à nouveau.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setEmailSent(false);
                  form.reset();
                }}
              >
                Essayer une autre adresse email
              </Button>
              <Button 
                className="w-full" 
                onClick={() => navigate("/")}
              >
                Retour à la connexion
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <MailIcon className="h-12 w-12 text-primary mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-primary">Carbon Footprint-TraLIS</h1>
          <p className="text-muted-foreground">Réinitialisation du mot de passe</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>
              Saisissez votre adresse email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="votre.email@exemple.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-700">
                    Si l'adresse email est associée à un compte, vous recevrez un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                </Button>
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2" onClick={() => navigate("/")}>
                  <ArrowLeft className="h-4 w-4" /> Retour à la connexion
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;