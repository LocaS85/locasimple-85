
// Placeholder Supabase client
// This is a temporary file to fix build errors.
// TODO: Replace with actual Supabase client integration

const supabase = {
  from: (table: string) => ({
    select: (columns: string) => {
      console.warn('Supabase client not fully configured - using mock data');
      return Promise.resolve({
        data: [
          { id: 1, name: 'User 1', email: 'user1@example.com' },
          { id: 2, name: 'User 2', email: 'user2@example.com' },
        ],
        error: null
      });
    }
  })
};

export default supabase;
