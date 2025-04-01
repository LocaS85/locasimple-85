
import React from 'react';
import { motion } from 'framer-motion';
import CustomFieldsForm from '@/components/CustomFieldsForm';

interface CustomFieldsSectionProps {
  categoryId: string;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({ categoryId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <CustomFieldsForm categoryId={categoryId} />
    </motion.div>
  );
};

export default CustomFieldsSection;
