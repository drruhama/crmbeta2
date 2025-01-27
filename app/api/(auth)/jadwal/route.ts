import { jadwalvisitTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { eq, and, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";
import { sql } from "drizzle-orm";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodeJadwal = Number(searchParams.get("kodeJadwal"));
    if (kodeJadwal) {
        try {
            const jadwalbycode = await db.select().from(jadwalvisitTable).where(and(eq(jadwalvisitTable.kodeJadwal, kodeJadwal), isNull(jadwalvisitTable.deletedAt)));
            return new NextResponse(JSON.stringify(jadwalbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching jadwal visit data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allSales = await db.select().from(jadwalvisitTable).where(isNull(jadwalvisitTable.deletedAt));
            return new NextResponse(JSON.stringify(allSales), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching jadwal visit data" + err.message, {
            status: 500,
        });      
    }
};

export const POST = async ( request: Request) => { 
    try {
  const body = await request.json();
  const newJadwal = await db.insert(jadwalvisitTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Jadwal visit is created", user: newJadwal }),
    { status: 200 }
   )        
} catch (error: any) {
    console.log(error.message)
    return new NextResponse("Error in creating jadwal visit" + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodeJadwal = Number(searchParams.get("kodeJadwal"));
        const body = await request.json();
        const { 
            tanggal,
            salesCd,
            tujuan,
            repeat,
            routeName,
            latAwal,
            longAwal,
            latAkhir,
            longAkhir,
            note,
            custCd,
            stage,
            realisasi,
            alasan,
            deletedAt } = body;
       
        if (!kodeJadwal) {
            return new NextResponse (
                JSON.stringify({ message: "Jadwal Code not found"}),
                { status: 400 }
            );
        }
        
        if (deletedAt) {
            const deletedJadwal = await db
      .update(jadwalvisitTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(jadwalvisitTable.kodeJadwal, kodeJadwal));

        if (!deletedJadwal) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete jadwal visit"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Jadwal visit data is deleted" }), { status: 200 });
        }

        const updatedJadwal = await db
      .update(jadwalvisitTable)
      .set({ 
            tanggal,
            salesCd,
            tujuan,
            repeat,
            routeName,
            latAwal,
            longAwal,
            latAkhir,
            longAkhir,
            note,
            custCd,
            stage,
            realisasi,
            alasan,
       })
      .where(eq(jadwalvisitTable.kodeJadwal, kodeJadwal));

        if (!updatedJadwal) {
            console.log(error)
            return new NextResponse(JSON.stringify({ message: "Failed, update jadwal visit"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Jadwal visit data is updated" }), { status: 200 });
    } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in updating jadwal visit data"}), { status: 500, });
    }
}

export const DELETE = async ( request: Request) => {
    // bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: export const DELETE = async (request: Request, context: { params: any }) => {
    try {
    const { searchParams } = new URL(request.url);
    const kodeJadwal = Number(searchParams.get("kodeJadwal"));
    //bisa juga kalau di folder api ditambah folder [userId] maka codenya berubah: const userId = context.params.userId;
    if (!kodeJadwal) {
        return new NextResponse(JSON.stringify({ message: "Jadwal Code not found"}), { status: 400 });
    }
    const deletedJadwal = await db.delete(jadwalvisitTable).where(eq(jadwalvisitTable.kodeJadwal, kodeJadwal));
    //bisa juga : const deletedUser = await User.findByIdAndDelete(userId) // kalau dua kriteria misal ( { _id: uerId, category: categoryId })
    if (!deletedJadwal) {
        return new NextResponse(JSON.stringify({ message: "Jadwal visit not found"}), { status: 400 });
    }
    return new NextResponse( JSON.stringify({ message: "Jadwal visit is deleted", user: deletedJadwal }), { status: 200 })
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: "Error in deleting jadwal visit data"}), { status : 500 })
    }
}

