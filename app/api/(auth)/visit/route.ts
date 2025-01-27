import { jadwalvisitTable, kunjunganTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { eq, and, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";
import { sql } from "drizzle-orm";
import { format } from 'date-fns';

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const today = format(new Date(), 'yyyy-MM-dd'); // Format current date to YYYY-MM-DD
   
    if (username) {
        try {
            const visitbycode = await db.select().from(kunjunganTable).where(and(and(eq(kunjunganTable.userName, username), isNull(kunjunganTable.deletedAt), eq(kunjunganTable.tglKunjungan, today))));
            return new NextResponse(JSON.stringify(visitbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching visit data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allVisit = await db.select().from(kunjunganTable).where(isNull(kunjunganTable.deletedAt));
            return new NextResponse(JSON.stringify(allVisit), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching visit data" + err.message, {
            status: 500,
        });      
    }
};

export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newKunjungan = await db.insert(kunjunganTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "visit is created", user: newKunjungan }),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating visit" + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeKunjungan = Number(searchParams.get("kodeKunjungan"));
        const body = await request.json();
        const { 
            deskripsi,
            tujuanVisit,
            hasilVisit,
            kdFoto,
            buktiActivity,
            note,
            checkoutAt,
            latAkhir,
            longAkhir,
            deletedAt } = body;
       
        if (!kodeKunjungan) {
            return new NextResponse (
                JSON.stringify({ message: "Visit Code not found"}),
                { status: 400 }
            );
        }
        
        if (deletedAt) {
            const deletedVisit = await db
      .update(kunjunganTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(kunjunganTable.noKunjungan, kodeKunjungan));

        if (!deletedVisit) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete visit"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Visit data is deleted" }), { status: 200 });
        }

        const updatedVisit = await db
      .update(kunjunganTable)
      .set({ 
        deskripsi,
        tujuanVisit,
        hasilVisit,
        kdFoto,
        buktiActivity,
        note,
        checkoutAt,
        latAkhir,
        longAkhir,
       })
      .where(eq(kunjunganTable.noKunjungan, kodeKunjungan));

        if (!updatedVisit) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Failed, update visit data"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Visit data is updated" }), { status: 200 });
    } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in updating visit data"}), { status: 500, });
    }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodeKunjungan = Number(searchParams.get("kodeKunjungan"));
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeKunjungan) {
        return new NextResponse(JSON.stringify({ message: "Visit Code not found"}), { status: 400 });
    }
    const deletedVisit = await db.delete(kunjunganTable).where(eq(kunjunganTable.noKunjungan, kodeKunjungan));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedVisit) {
        return new NextResponse(JSON.stringify({ message: "Visit not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Visit is deleted", user: deletedVisit }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting visit data"}), { status : 500 })
    }
}

