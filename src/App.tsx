import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJsApiLoader } from '@react-google-maps/api';
import { Header } from '@/components/Header';
import { Home } from '@/pages/Home';
import type { LoadScriptProps } from '@react-google-maps/api';

const queryClient = new QueryClient();
const libraries: LoadScriptProps['libraries'] = ['places'];

const App: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || '',
    libraries,
  });

  if (loadError) return <p className="text-red-500">Erro ao carregar mapas</p>;
  if (!isLoaded) return <p className="text-gray-200">Carregando mapas...</p>;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Home />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
