
#!/usr/bin/env python3
"""
Script de démarrage du serveur Flask
"""

import os
import sys
from app import app

if __name__ == "__main__":
    # Vérifier si le fichier .env existe
    if not os.path.exists('.env'):
        print("ATTENTION: Fichier .env non trouvé!")
        print("Veuillez créer un fichier .env basé sur .env.example")
        
        # Vérifier si .env.example existe
        if os.path.exists('.env.example'):
            print("Exemple: cp .env.example .env")
        sys.exit(1)
    
    # Vérifier si le dossier static existe, sinon le créer
    static_dir = os.path.join(app.root_path, 'static')
    if not os.path.exists(static_dir):
        os.makedirs(static_dir)
        print(f"Dossier {static_dir} créé.")
    
    print("Démarrage du serveur Flask...")
    print("L'application sera accessible à l'adresse: http://127.0.0.1:5000/")
    app.run(debug=True, host='0.0.0.0', port=5000)
