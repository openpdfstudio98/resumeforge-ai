const jpegPrefix = "data:image/jpeg;base64,";
const maxFileBytes = 10 * 1024 * 1024;
const maxPhotoChars = 180_000;

export function isResumePhoto(value: unknown): value is string {
  if (typeof value !== "string" || !value.startsWith(jpegPrefix) || value.length > maxPhotoChars) return false;
  const bytes = value.slice(jpegPrefix.length);
  return bytes.length % 4 === 0 && /^\/9j\/[A-Za-z0-9+/]+={0,2}$/.test(bytes) && atob(bytes.slice(-8)).endsWith("\xff\xd9");
}

export async function preparePhoto(file: File): Promise<string> {
  if (!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > maxFileBytes) throw new Error("Unsupported photo");
  const source = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = source;
    await image.decode();
    const side = Math.min(image.naturalWidth,image.naturalHeight);
    if (!side || image.naturalWidth * image.naturalHeight > 50_000_000) throw new Error("Invalid photo dimensions");
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = Math.min(side,384);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image editing unavailable");
    context.fillStyle = "#ffffff";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,canvas.width,canvas.height);
    const result = canvas.toDataURL("image/jpeg",0.83);
    if (!isResumePhoto(result)) throw new Error("Invalid resized photo");
    return result;
  } finally {
    URL.revokeObjectURL(source);
  }
}
