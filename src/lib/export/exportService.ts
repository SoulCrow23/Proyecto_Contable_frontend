import { Platform, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Paths, File } from 'expo-file-system';

export interface ExportPdfOptions {
  html: string;
  filename: string;
  title?: string;
}

export interface ExportCsvOptions {
  csvContent: string;
  filename: string;
  title?: string;
}

/**
 * Servicio unificado para exportar documentos PDF e imprimirlos en Web y Móvil.
 */
export async function exportarAPdf(options: ExportPdfOptions): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // En Web, printAsync lanza la ventana de impresión nativa del navegador
      await Print.printAsync({ html: options.html });
      return;
    }

    // En Android / iOS, genera el archivo temporal en disco y abre el diálogo nativo de compartir
    const { uri } = await Print.printToFileAsync({ html: options.html });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: options.title || 'Exportar Documento Contable',
      });
    } else {
      Alert.alert('Éxito', `Archivo PDF generado temporalmente en: ${uri}`);
    }
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    Alert.alert('Error', 'No se pudo generar o exportar el documento PDF.');
  }
}

/**
 * Servicio unificado para exportar archivos CSV a Excel en Web y Móvil.
 */
export async function exportarACsv(options: ExportCsvOptions): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // En Web, descarga directa mediante Blob HTML5
      const blob = new Blob([options.csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', options.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    // En Android / iOS, usar la API moderna de FileSystem de Expo SDK 58
    const file = new File(Paths.cache, options.filename);
    if (!file.exists) {
      file.create();
    }
    await file.write(options.csvContent);

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: options.title || options.filename,
      });
    } else {
      Alert.alert('Éxito', `Archivo guardado en: ${file.uri}`);
    }
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    Alert.alert('Error', 'No se pudo generar o exportar el archivo CSV.');
  }
}
