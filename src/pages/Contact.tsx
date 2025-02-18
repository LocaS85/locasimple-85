import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé avec succès !");
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-4xl font-bold text-center mb-12">Contactez-nous</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" placeholder="Votre nom" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Votre message..."
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Mail className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600">contact@locasimple.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="w-6 h-6 text-secondary" />
            <div>
              <h3 className="font-semibold">Téléphone</h3>
              <p className="text-gray-600">+33 1 23 45 67 89</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MessageSquare className="w-6 h-6 text-accent" />
            <div>
              <h3 className="font-semibold">Support</h3>
              <p className="text-gray-600">Disponible 7j/7 de 9h à 18h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
