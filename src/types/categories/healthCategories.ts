
import { Category } from '../categoryTypes';

export const HEALTH_CATEGORIES: Category[] = [
  {
    id: 'sante',
    name: 'Santé et Bien-être',
    icon: '⚕️',
    subCategories: [
      { 
        id: 'hopitaux', 
        name: 'Hôpitaux', 
        parentId: 'sante',
        description: 'Établissements de soins pour des traitements hospitaliers'
      },
      { 
        id: 'cliniques', 
        name: 'Cliniques', 
        parentId: 'sante',
        description: 'Établissements de soins privés pour consultations et traitements'
      },
      { 
        id: 'dentistes', 
        name: 'Dentistes', 
        parentId: 'sante',
        description: 'Professionnels spécialisés en santé bucco-dentaire'
      },
      { 
        id: 'medecins', 
        name: 'Médecins généralistes', 
        parentId: 'sante',
        description: 'Praticiens pour les soins médicaux courants'
      },
      { 
        id: 'pharmacies', 
        name: 'Pharmacies', 
        parentId: 'sante',
        description: 'Points de vente de médicaments et produits de santé'
      },
      { 
        id: 'laboratoires', 
        name: 'Laboratoires d\'analyses médicales', 
        parentId: 'sante',
        description: 'Centres pour analyses biologiques et médicales'
      },
      { 
        id: 'opticiens', 
        name: 'Opticiens', 
        parentId: 'sante',
        description: 'Spécialistes des corrections visuelles et lunettes'
      },
      { 
        id: 'radiologie', 
        name: 'Centres de radiologie', 
        parentId: 'sante',
        description: 'Centres d\'imagerie médicale et diagnostique'
      },
      { 
        id: 'psychologues', 
        name: 'Psychologues', 
        parentId: 'sante',
        description: 'Professionnels de la santé mentale'
      },
      { 
        id: 'veterinaires', 
        name: 'Vétérinaires', 
        parentId: 'sante',
        description: 'Spécialistes de la santé animale'
      },
    ]
  }
];
