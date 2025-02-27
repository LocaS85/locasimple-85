
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Clock, Heart, ArrowLeft, Home, Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  
  const handleDeleteAccount = () => {
    toast.success("Votre compte a été supprimé avec succès");
    navigate("/");
  };

  const handleSaveChanges = () => {
    toast.success("Modifications enregistrées avec succès");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="flex items-center space-x-4 p-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles ici
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">Prénom</Label>
                  <Input id="firstname" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@exemple.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+33 6 12 34 56 78" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse postale</Label>
                <Input id="address" placeholder="123 rue de la Paix" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Code postal</Label>
                  <Input id="postal-code" placeholder="75000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" placeholder="Paris" />
                </div>
              </div>
              <Button onClick={handleSaveChanges}>Sauvegarder les modifications</Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Rechercher
                  </Button>
                </Link>
              </div>

              <div className="pt-6 border-t mt-6">
                <h3 className="text-lg font-semibold text-destructive mb-4">Zone dangereuse</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données personnelles, favoris et historique seront définitivement supprimés.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Mes favoris</CardTitle>
              <CardDescription>
                Lieux et itinéraires que vous avez sauvegardés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link to={`/place/${i}`} key={i}>
                    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <MapPin className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{`Restaurant Exemple ${i}`}</h3>
                        <p className="text-sm text-muted-foreground">
                          {`${123 + i} rue de la Paix, Paris`}
                        </p>
                      </div>
                      <Heart className="text-red-500 h-5 w-5" />
                    </div>
                  </Link>
                ))}
                
                {[1, 2, 3].length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Aucun favori</h3>
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore de lieux favoris</p>
                    <Button asChild>
                      <Link to="/search">
                        <Search className="mr-2 h-4 w-4" />
                        Rechercher des lieux
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des recherches</CardTitle>
              <CardDescription>
                Vos dernières recherches et itinéraires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Clock className="text-muted-foreground h-5 w-5" />
                    <div>
                      <h3 className="font-medium">{`Recherche: ${i === 1 ? 'Restaurants à Paris' : i === 2 ? 'Hôtels à Lyon' : i === 3 ? 'Cafés à Marseille' : 'Musées à Toulouse'}`}</h3>
                      <p className="text-sm text-muted-foreground">Il y a {i} jour{i > 1 ? 's' : ''}</p>
                    </div>
                    <Link to="/search" className="ml-auto">
                      <Button variant="ghost" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
