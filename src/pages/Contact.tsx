
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('messageSent'));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('back')}
      </Button>

      <h1 className="text-4xl font-bold text-center mb-12">{t('contactUs')}</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input id="name" placeholder={t('yourName')} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" type="email" placeholder={t('yourEmail')} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t('message')}</Label>
                <textarea
                  id="message"
                  className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder={t('yourMessage')}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {t('sendMessage')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Mail className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">{t('email')}</h3>
              <p className="text-gray-600">contact@locasimple.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="w-6 h-6 text-secondary" />
            <div>
              <h3 className="font-semibold">{t('phone')}</h3>
              <p className="text-gray-600">+33 1 23 45 67 89</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MessageSquare className="w-6 h-6 text-accent" />
            <div>
              <h3 className="font-semibold">{t('support')}</h3>
              <p className="text-gray-600">{t('supportAvailability')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
