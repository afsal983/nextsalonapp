// Convert Base64 to Blob with callbacks
export function base64ToBlob(b64Data: string, mimeType: string) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);

  return new Blob([byteArray]);
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // Extract the Base64 string from the Data URL
      const base64String = reader.result?.toString().split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

export async function blobToImageBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
