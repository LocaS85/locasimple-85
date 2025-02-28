
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Building, 
  PaypalLogo, 
  CalendarDays, 
  CalendarClock,
  ArrowRight, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planParam = searchParams.get('plan') || 'premium';
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bankTransfer' | 'paypal'>('card');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [formValid, setFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Plans data
  const plans = {
    premium: {
      name: "Premium",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      description: "Pour les utilisateurs réguliers",
      features: [
        "Recherches illimitées",
        "Rayon de recherche jusqu'à 25 km",
        "Filtres avancés (durée et distance)",
        "Jusqu'à 10 résultats par recherche"
      ]
    },
    pro: {
      name: "Pro",
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      description: "Pour les professionnels",
      features: [
        "Toutes les fonctionnalités Premium",
        "Rayon de recherche illimité",
        "Filtres personnalisables",
        "Résultats illimités par recherche"
      ]
    }
  };
  
  const selectedPlan = planParam === 'pro' ? plans.pro : plans.premium;
  const price = billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice;
  const annualSavings = ((selectedPlan.monthlyPrice * 12) - selectedPlan.annualPrice).toFixed(2);
  
  // Card payment form
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Bank transfer details
  const bankDetails = {
    accountName: "Cartographie Services SAS",
    iban: "FR76 1234 5678 9123 4567 8912 345",
    bic: "ABCDEFGHIJK",
    reference: `PLAN-${selectedPlan.name.toUpperCase()}-${Date.now().toString().slice(-6)}`
  };
  
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
    
    // Basic form validation
    const { cardNumber, cardHolder, expiryDate, cvv } = { ...cardDetails, [name]: value };
    setFormValid(
      paymentMethod === 'card' 
        ? cardNumber.length >= 16 && cardHolder.length > 3 && expiryDate.length === 5 && cvv.length >= 3
        : true
    );
  };
  
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };
  
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 4)
      .replace(/(\d{2})(\d{2})/, '$1/$2')
      .replace(/(\d{2})(\d{1})/, '$1/$2');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Paiement réussi !",
        description: `Vous avez souscrit au plan ${selectedPlan.name} en formule ${billingCycle === 'monthly' ? 'mensuelle' : 'annuelle'}.`,
        variant: "default",
      });
      navigate('/profile');
    }, 2000);
  };
  
  const handlePaypalCheckout = () => {
    setLoading(true);
    // Simulate PayPal redirect
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Redirection vers PayPal",
        description: "Vous allez être redirigé vers le service de paiement PayPal.",
        variant: "default",
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="grid md:grid-cols-5 gap-8">
          {/* Payment selection section */}
          <div className="md:col-span-3 bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6">Finaliser votre abonnement</h1>
            
            <Tabs defaultValue={billingCycle} onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')}>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Cycle de facturation</h2>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                  <TabsTrigger value="annual">Annuel <span className="ml-1 text-xs text-green-600">(Économisez {annualSavings}€)</span></TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="monthly" className="mb-8">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <RadioGroup value={autoRenew ? "auto" : "manual"} onValueChange={(value) => setAutoRenew(value === "auto")}>
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="auto" id="auto-renew" />
                      <Label htmlFor="auto-renew" className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-2 text-primary" />
                        Renouvellement automatique
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual-renew" />
                      <Label htmlFor="manual-renew" className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                        Paiement mensuel sans renouvellement
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-gray-500 mt-2">
                    {autoRenew 
                      ? "Votre abonnement sera automatiquement renouvelé chaque mois. Vous pouvez annuler à tout moment."
                      : "Vous serez notifié avant la fin de votre période d'abonnement et devrez renouveler manuellement."}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="annual">
                <div className="p-4 border border-green-100 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800">
                      Économisez {annualSavings}€ avec notre forfait annuel par rapport au paiement mensuel.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="my-8">
              <h2 className="text-lg font-medium mb-4">Mode de paiement</h2>
              <div className="grid grid-cols-3 gap-4">
                <button
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className={`h-8 w-8 mb-2 ${paymentMethod === 'card' ? 'text-primary' : 'text-gray-500'}`} />
                  <span className="text-sm">Carte bancaire</span>
                </button>
                
                <button
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
                    paymentMethod === 'bankTransfer' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('bankTransfer')}
                >
                  <Building className={`h-8 w-8 mb-2 ${paymentMethod === 'bankTransfer' ? 'text-primary' : 'text-gray-500'}`} />
                  <span className="text-sm">Virement bancaire</span>
                </button>
                
                <button
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${
                    paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <PaypalLogo className={`h-8 w-8 mb-2 ${paymentMethod === 'paypal' ? 'text-primary' : 'text-gray-500'}`} />
                  <span className="text-sm">PayPal</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(cardDetails.cardNumber)}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value.replace(/\s/g, ''));
                        setCardDetails(prev => ({ ...prev, cardNumber: formatted.replace(/\s/g, '') }));
                      }}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardHolder">Titulaire de la carte</Label>
                    <Input
                      id="cardHolder"
                      name="cardHolder"
                      placeholder="JEAN DUPONT"
                      value={cardDetails.cardHolder}
                      onChange={handleCardInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Date d'expiration</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => {
                          const formattedDate = formatExpiryDate(e.target.value);
                          setCardDetails(prev => ({ ...prev, expiryDate: formattedDate }));
                        }}
                        maxLength={5}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-4" 
                    disabled={!formValid || loading}
                  >
                    {loading ? "Traitement en cours..." : `Payer ${price.toFixed(2)}€`}
                  </Button>
                </div>
              )}
              
              {paymentMethod === 'bankTransfer' && (
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <p className="font-medium mb-4">Informations de virement bancaire</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bénéficiaire:</span>
                        <span className="font-medium">{bankDetails.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">IBAN:</span>
                        <span className="font-mono">{bankDetails.iban}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">BIC:</span>
                        <span className="font-mono">{bankDetails.bic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Référence:</span>
                        <span className="font-mono">{bankDetails.reference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Veuillez effectuer le virement du montant exact de {price.toFixed(2)}€ avec la référence indiquée ci-dessus. 
                      Votre abonnement sera activé dès réception du paiement (délai de 1 à 3 jours ouvrés).
                    </p>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full" 
                    onClick={() => {
                      navigator.clipboard.writeText(`${bankDetails.accountName}\nIBAN: ${bankDetails.iban}\nBIC: ${bankDetails.bic}\nRéférence: ${bankDetails.reference}\nMontant: ${price.toFixed(2)}€`);
                      toast({
                        title: "Informations copiées",
                        description: "Les informations de paiement ont été copiées dans le presse-papier.",
                        variant: "default",
                      });
                    }}
                  >
                    Copier les informations de paiement
                  </Button>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50 text-center">
                    <p className="text-blue-800">
                      Vous allez être redirigé vers PayPal pour finaliser votre paiement de {price.toFixed(2)}€.
                    </p>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
                    onClick={handlePaypalCheckout}
                    disabled={loading}
                  >
                    {loading ? "Redirection..." : "Payer avec PayPal"}
                  </Button>
                </div>
              )}
            </form>
          </div>
          
          {/* Order summary section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>
              
              <div className="flex justify-between items-center pb-4 mb-4 border-b">
                <div>
                  <h3 className="font-medium">{selectedPlan.name}</h3>
                  <p className="text-sm text-gray-500">{selectedPlan.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-medium">{price.toFixed(2)}€</span>
                  <p className="text-xs text-gray-500">
                    {billingCycle === 'monthly' ? 'par mois' : 'par an'}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Inclus dans votre plan :</h3>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t border-b font-medium">
                <span>Total</span>
                <span>{price.toFixed(2)}€</span>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>
                  En procédant au paiement, vous acceptez nos{' '}
                  <a href="/terms" className="text-primary hover:underline">Conditions d'utilisation</a>{' '}
                  et notre{' '}
                  <a href="/privacy" className="text-primary hover:underline">Politique de confidentialité</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
