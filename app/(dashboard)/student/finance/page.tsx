import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Wallet, Receipt, CreditCard, Clock, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Keuangan & SPP - Fokuspad",
};

export default async function StudentFinancePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const billings = await prisma.billing.findMany({
    where: { studentId: session.user.id },
    orderBy: { dueDate: "desc" },
  });

  const totalUnpaid = billings
    .filter((b) => b.status === "UNPAID" || b.status === "PENDING")
    .reduce((sum, b) => sum + b.amount, 0);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Keuangan & SPP</h1>
        <p className="text-muted-foreground mt-1">Pantau tagihan dan riwayat pembayaran Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Tagihan Belum Lunas</h3>
            <Wallet className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatRupiah(totalUnpaid)}</div>
          <p className="text-xs text-muted-foreground mt-1">Segera lunasi sebelum jatuh tempo</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b px-6 py-4 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Daftar Tagihan</h3>
        </div>
        <div className="p-0">
          {billings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Receipt className="h-10 w-10 text-slate-300 mb-3" />
              <p>Tidak ada data tagihan.</p>
            </div>
          ) : (
            <div className="divide-y">
              {billings.map((bill) => (
                <div key={bill.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 \${
                      bill.status === "PAID" 
                        ? "bg-emerald-100 text-emerald-600"
                        : bill.status === "PENDING"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-rose-100 text-rose-600"
                    }`}>
                      {bill.status === "PAID" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : bill.status === "PENDING" ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <CreditCard className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{bill.title}</h4>
                      {bill.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{bill.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full \${
                          bill.status === "PAID" 
                            ? "bg-emerald-100 text-emerald-700"
                            : bill.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}>
                          {bill.status === "PAID" ? "Lunas" : bill.status === "PENDING" ? "Menunggu Verifikasi" : "Belum Lunas"}
                        </span>
                        <span className="text-slate-500">
                          Jatuh Tempo: {format(new Date(bill.dueDate), "dd MMM yyyy", { locale: id })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-lg font-bold text-slate-900">{formatRupiah(bill.amount)}</div>
                    {bill.status !== "PAID" && (
                      <button className="mt-2 text-xs font-medium text-[#5483B3] hover:text-[#3B638A] transition-colors">
                        Cara Pembayaran &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
