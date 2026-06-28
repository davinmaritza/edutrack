import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format, isPast, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { Library, Book, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Perpustakaan - Fokuspad",
};

export default async function StudentLibraryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const circulations = await prisma.bookCirculation.findMany({
    where: { studentId: session.user.id },
    include: { book: true },
    orderBy: { borrowDate: "desc" },
  });

  const activeLoans = circulations.filter((c) => c.status === "BORROWED" || c.status === "OVERDUE");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Perpustakaan Siswa</h1>
        <p className="text-muted-foreground mt-1">Pantau buku yang sedang Anda pinjam dan riwayat pengembalian.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Buku Sedang Dipinjam</h3>
            <Book className="h-4 w-4 text-[#5483B3]" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeLoans.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Pastikan kembali tepat waktu</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b px-6 py-4 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Daftar Peminjaman</h3>
        </div>
        <div className="p-0">
          {circulations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Library className="h-10 w-10 text-slate-300 mb-3" />
              <p>Belum ada riwayat peminjaman buku.</p>
            </div>
          ) : (
            <div className="divide-y">
              {circulations.map((circ) => {
                const isLate = circ.status === "OVERDUE" || (circ.status === "BORROWED" && isPast(new Date(circ.dueDate)) && !isSameDay(new Date(circ.dueDate), new Date()));
                
                return (
                  <div key={circ.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {circ.book.coverImage ? (
                        <div className="h-16 w-12 shrink-0 rounded overflow-hidden relative border shadow-sm">
                          <Image src={circ.book.coverImage} alt={circ.book.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-16 w-12 shrink-0 rounded bg-slate-100 border flex items-center justify-center text-slate-400">
                          <Book className="h-6 w-6" />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-semibold text-slate-900 leading-tight">{circ.book.title}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{circ.book.author}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs font-medium">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full \${
                            circ.status === "RETURNED" 
                              ? "bg-emerald-100 text-emerald-700"
                              : isLate
                              ? "bg-rose-100 text-rose-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {circ.status === "RETURNED" ? (
                              <><CheckCircle2 className="h-3 w-3" /> Dikembalikan</>
                            ) : isLate ? (
                              <><AlertTriangle className="h-3 w-3" /> Terlambat</>
                            ) : (
                              <><Clock className="h-3 w-3" /> Dipinjam</>
                            )}
                          </span>
                          
                          {circ.status === "RETURNED" ? (
                            <span className="text-emerald-600">
                              Dikembalikan: {format(new Date(circ.returnDate!), "dd MMM yyyy", { locale: id })}
                            </span>
                          ) : (
                            <span className={isLate ? "text-rose-600 font-semibold" : "text-slate-500"}>
                              Tenggat: {format(new Date(circ.dueDate), "dd MMM yyyy", { locale: id })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {circ.penalty > 0 && (
                      <div className="sm:text-right shrink-0 mt-2 sm:mt-0 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                        <p className="text-xs text-rose-600 font-medium">Denda Keterlambatan</p>
                        <div className="text-sm font-bold text-rose-700">Rp {circ.penalty.toLocaleString("id-ID")}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
