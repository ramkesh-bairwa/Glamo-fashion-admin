import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Define the file type if not using the native `File` (browser-specific)
interface File {
  name: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export async function uploadFile(
  file: File | null,
  folderName: string
): Promise<string | null> {
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads", folderName);

    // Ensure the folder exists before uploading
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return fileName;
  }

  return null;
}
