import AsyncStorage from '@react-native-async-storage/async-storage';
import { Empresa, CuentaContable, AsientoContable } from '../types/contabilidad.types';
import { initialEmpresa, initialCuentas, initialAsientos } from '../../store/initialData';

const STORAGE_KEYS = {
  EMPRESA: '@contabilidad_empresa',
  CUENTAS: '@contabilidad_cuentas',
  ASIENTOS: '@contabilidad_asientos',
};

export interface IContabilidadStorage {
  loadEmpresa(): Promise<Empresa>;
  saveEmpresa(empresa: Empresa): Promise<void>;
  loadCuentas(): Promise<CuentaContable[]>;
  saveCuentas(cuentas: CuentaContable[]): Promise<void>;
  loadAsientos(): Promise<AsientoContable[]>;
  saveAsientos(asientos: AsientoContable[]): Promise<void>;
  resetToInitial(): Promise<void>;
}

export const localContabilidadStorage: IContabilidadStorage = {
  async loadEmpresa(): Promise<Empresa> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EMPRESA);
      return data ? JSON.parse(data) : initialEmpresa;
    } catch {
      return initialEmpresa;
    }
  },

  async saveEmpresa(empresa: Empresa): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EMPRESA, JSON.stringify(empresa));
    } catch (e) {
      console.error('Error saving empresa', e);
    }
  },

  async loadCuentas(): Promise<CuentaContable[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUENTAS);
      return data ? JSON.parse(data) : initialCuentas;
    } catch {
      return initialCuentas;
    }
  },

  async saveCuentas(cuentas: CuentaContable[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CUENTAS, JSON.stringify(cuentas));
    } catch (e) {
      console.error('Error saving cuentas', e);
    }
  },

  async loadAsientos(): Promise<AsientoContable[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ASIENTOS);
      return data ? JSON.parse(data) : initialAsientos;
    } catch {
      return initialAsientos;
    }
  },

  async saveAsientos(asientos: AsientoContable[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ASIENTOS, JSON.stringify(asientos));
    } catch (e) {
      console.error('Error saving asientos', e);
    }
  },

  async resetToInitial(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.EMPRESA),
        AsyncStorage.removeItem(STORAGE_KEYS.CUENTAS),
        AsyncStorage.removeItem(STORAGE_KEYS.ASIENTOS),
      ]);
    } catch (e) {
      console.error('Error resetting storage', e);
    }
  },
};
