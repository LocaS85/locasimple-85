
import React from 'react';
import { SearchContainer } from '@/components/search/SearchContainer';
import Layout from '@/components/Layout';

const Search = () => {
  return (
    <Layout className="h-screen p-0 overflow-hidden">
      <SearchContainer />
    </Layout>
  );
};

export default Search;
