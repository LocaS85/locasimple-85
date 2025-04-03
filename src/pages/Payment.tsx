
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Get plan from URL params
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan') || 'premium';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('paymentSuccessful'));
    setTimeout(() => navigate('/profile'), 1500);
  };
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-md">
      <Button 
        variant="ghost" 
        className="mb-8"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('back')}
      </Button>
      
      <div className="text-center mb-8">
        <CreditCard className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold mb-2">{t('payment')}</h1>
        <p className="text-gray-600">
          {plan === 'premium' ? t('premiumPlanPayment') : t('proPlanPayment')}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md">
        <div className="space-y-2">
          <Label htmlFor="cardName">{t('nameOnCard')}</Label>
          <Input id="cardName" placeholder="John Doe" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">{t('cardNumber')}</Label>
          <Input 
            id="cardNumber" 
            placeholder="4242 4242 4242 4242" 
            required 
            maxLength={19}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">{t('expiryDate')}</Label>
            <Input id="expiry" placeholder="MM/YY" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" required maxLength={3} />
          </div>
        </div>
        
        <div className="pt-2">
          <Button type="submit" className="w-full">{t('completePayment')}</Button>
        </div>
        
        <div className="flex items-center justify-center text-sm text-gray-500 pt-4">
          <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
          <span>{t('securePayment')}</span>
        </div>
      </form>
    </div>
  );
};

export default Payment;
