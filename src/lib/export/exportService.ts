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
 * Excel de escritorio en Windows puede abrir un CSV UTF-8 como ANSI aunque el
 * archivo lleve BOM. UTF-16LE con BOM es el formato que reconoce de forma
 * inequívoca al abrir un CSV descargado desde el navegador.
 */
function crearBlobCsvCompatibleConExcel(csvContent: string): Blob {
  const contenido = csvContent.replace(/^\uFEFF/, '');
  const bytes = new Uint8Array(2 + contenido.length * 2);

  // BOM UTF-16 little-endian.
  bytes[0] = 0xff;
  bytes[1] = 0xfe;

  for (let indice = 0; indice < contenido.length; indice += 1) {
    const codigo = contenido.charCodeAt(indice);
    bytes[2 + indice * 2] = codigo & 0xff;
    bytes[3 + indice * 2] = codigo >> 8;
  }

  return new Blob([bytes], { type: 'text/csv;charset=utf-16le;' });
}

/**
 * En navegadores Expo Print delega la impresión al documento que está abierto.
 * Abrimos un documento temporal con el HTML del reporte para que el navegador no
 * incluya el panel de navegación, botones ni estilos de la aplicación.
 */
function imprimirDocumentoWeb(html: string, title?: string): void {
  const ventanaImpresion = window.open('', '_blank');

  if (!ventanaImpresion) {
    Alert.alert(
      'No se pudo abrir la impresión',
      'Permite las ventanas emergentes para generar el documento PDF.'
    );
    return;
  }

  ventanaImpresion.document.open();
  ventanaImpresion.document.write(html);
  ventanaImpresion.document.close();

  if (title) {
    ventanaImpresion.document.title = title;
  }

  ventanaImpresion.addEventListener(
    'afterprint',
    () => {
      ventanaImpresion.close();
    },
    { once: true }
  );

  ventanaImpresion.focus();
  ventanaImpresion.print();
}

/**
 * Servicio unificado para exportar documentos PDF e imprimirlos en Web y Móvil.
 */
export async function exportarAPdf(options: ExportPdfOptions): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      imprimirDocumentoWeb(options.html, options.title);
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
      // En Web se usa UTF-16LE para que Excel preserve los acentos al abrirlo.
      const blob = crearBlobCsvCompatibleConExcel(options.csvContent);
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
