
import React from 'react';
import { useCategory } from '../CategoryContext';
import { AddressForm } from '@/components/AddressForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface AddressSectionProps {
  categoryId: string;
}

const AddressSection: React.FC<AddressSectionProps> = ({ categoryId }) => {
  const { addresses } = useCategory();
  const { t } = useLanguage();
  
  const currentAddresses = addresses[categoryId] || [];
  const canAddAddress = currentAddresses.length < 10;
  const isMainAddress = categoryId === 'adresse-principale';

  return (
    <>
      {isMainAddress && currentAddresses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Alert>
            <Home className="h-4 w-4" />
            <AlertTitle>{t('mainAddress')}</AlertTitle>
            <AlertDescription>
              {t('mainAddressDescription')}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      {canAddAddress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <AddressForm categoryId={categoryId} />
        </motion.div>
      )}
    </>
  );
};

export default AddressSection;
