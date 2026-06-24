import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan direktori penyimpanan lokal (public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Buat folder jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Buat nama file unik
    const fileExt = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = path.join(uploadDir, filename);

    // Simpan file ke sistem penyimpanan lokal VPS/Komputer
    fs.writeFileSync(filePath, buffer);

    // URL publik akses file
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: publicUrl, name: file.name });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file secara lokal" }, { status: 500 });
  }
}
