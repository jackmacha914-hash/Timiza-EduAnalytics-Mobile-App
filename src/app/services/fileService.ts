import * as DocumentPicker from "expo-document-picker";

export async function pickDocument() {
  const result = await DocumentPicker.getDocumentAsync({
    multiple: false,
    copyToCacheDirectory: true,
  });

  return result;
}