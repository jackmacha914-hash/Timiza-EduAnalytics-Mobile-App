import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export async function downloadFile(url: string) {
  try {
    const filename = url.split("/").pop() || "download";

    const fileUri = FileSystem.documentDirectory + filename;

    const result = await FileSystem.downloadAsync(
      url,
      fileUri
    );

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(result.uri);
    }

    return result.uri;
  } catch (error) {
    console.log(error);
  }
}