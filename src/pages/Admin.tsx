
import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient"; // Import the Supabase client
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]); // Store users
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState<string | null>(null);

  // Function to fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.from("users").select("*");
      
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
      console.log("Users fetched successfully:", data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle adding a new user
  const handleAddUser = () => {
    toast.info("This functionality will be implemented soon");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Administration</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* User display */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        onClick={() => toast.info(`Éditer l'utilisateur ${user.name}`)}
                      >
                        Éditer
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => toast.info(`Supprimer l'utilisateur ${user.name}`)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add user button */}
      <button
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        onClick={handleAddUser}
      >
        Ajouter un utilisateur
      </button>

      {/* Refresh button */}
      <button
        className="mt-6 ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
        onClick={fetchUsers}
        disabled={loading}
      >
        {loading ? "Chargement..." : "Rafraîchir"}
      </button>
    </div>
  );
};

export default Admin;
