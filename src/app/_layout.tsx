import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useContabilidadStore } from '../store/contabilidadStore';

export default function RootLayout() {
  const inicializar = useContabilidadStore((state) => state.inicializar);

  useEffect(() => {
    void inicializar();
  }, [inicializar]);

  return <><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }} /></>;
}
