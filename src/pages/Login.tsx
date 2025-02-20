
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Facebook, Scan, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const Login = () => {
  const [isFaceIDAvailable, setIsFaceIDAvailable] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Connexion réussie !");
  };

  const handleFacebookLogin = () => {
    console.log("Connexion avec Facebook");
    toast.info("Connexion avec Facebook en cours...");
  };

  const handleFaceIDLogin = async () => {
    try {
      // Vérification de la disponibilité de l'API FaceID
      const supported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!supported) {
        toast.error("Face ID n'est pas disponible sur cet appareil");
        return;
      }

      // Création des options pour l'authentification
      const options = {
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          userVerification: "required" as UserVerificationRequirement,
        }
      };

      // Démarrage de l'authentification biométrique
      await navigator.credentials.get(options);
      toast.success("Authentification Face ID réussie !");
    } catch (error) {
      toast.error("Erreur lors de l'authentification Face ID");
      console.error(error);
    }
  };

  // Vérification de la disponibilité de Face ID au chargement
  React.useEffect(() => {
    async function checkFaceIDAvailability() {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsFaceIDAvailable(available);
      } catch (error) {
        setIsFaceIDAvailable(false);
      }
    }
    checkFaceIDAvailability();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Connexion</h1>
          <p className="text-gray-600">Connectez-vous pour accéder à vos lieux favoris</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleFacebookLogin}
          >
            <Facebook className="mr-2 h-4 w-4 text-blue-600" />
            Continuer avec Facebook
          </Button>

          {isFaceIDAvailable && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleFaceIDLogin}
            >
              <Scan className="mr-2 h-4 w-4" />
              Se connecter avec Face ID
            </Button>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Ou connectez-vous avec
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input placeholder="vous@exemple.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input type="password" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
              <p className="text-center text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
