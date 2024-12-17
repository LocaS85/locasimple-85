import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Mail, User, Google } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleEmailRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email registration logic
    toast({
      title: "Inscription réussie",
      description: "Votre compte a été créé avec succès.",
    });
    navigate("/profile");
  };

  const handleGoogleRegister = () => {
    // TODO: Implement Google registration logic
    toast({
      title: "Google Sign Up",
      description: "Connexion avec Google en cours...",
    });
  };

  const handleFacebookRegister = () => {
    // TODO: Implement Facebook registration logic
    toast({
      title: "Facebook Sign Up",
      description: "Connexion avec Facebook en cours...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Choisissez votre méthode d'inscription préférée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
            >
              <Google className="mr-2 h-4 w-4" />
              Continuer avec Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleFacebookRegister}
            >
              <Facebook className="mr-2 h-4 w-4" />
              Continuer avec Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Ou inscrivez-vous avec
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              S'inscrire avec Email
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Connectez-vous
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;