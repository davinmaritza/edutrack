import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // Batasi ukuran file (misal maks 2MB untuk mencegah database menjadi terlalu berat)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ukuran file terlalu besar (maksimal 2MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Konversi file gambar menjadi format Base64 Data URL
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Kembalikan base64 string sebagai URL. 
    // String ini akan disimpan langsung ke kolom 'image' (tipe data Text) di database User Anda.
    return NextResponse.json({ url: base64Image, name: file.name });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Gagal memproses gambar" }, { status: 500 });
  }
}
