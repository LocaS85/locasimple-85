import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient"; // Importer la config Supabase

const Admin = () => {
  const [users, setUsers] = useState([]); // Stocker les utilisateurs
  const [loading, setLoading] = useState(true); // Gérer le chargement

  // Fonction pour récupérer les utilisateurs depuis Supabase
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*"); // Récupère les utilisateurs
    if (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } else {
      setUsers(data); // Met à jour le state
    }
    setLoading(false);
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Administration</h1>

      {/* Affichage des utilisateurs */}
      {loading ? (
        <p>Chargement des utilisateurs...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Bouton pour ajouter un utilisateur */}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => alert("Ajout d'un utilisateur à implémenter")}
      >
        Ajouter un utilisateur
      </button>
    </div>
  );
};

export default Admin;
