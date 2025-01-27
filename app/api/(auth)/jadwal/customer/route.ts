import { customerTable, jadwalvisitTable, salesTable } from "@/db/schema";
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
    const tanggal = String(searchParams.get("tanggal"));
    //const today = format(new Date(), 'yyyy-MM-dd'); // Format current date to YYYY-MM-DD
   
    if (username) {
        try {
            //const jadwalbycode = await db.select().from(jadwalvisitTable).where(and(and(eq(jadwalvisitTable.userName, username), isNull(jadwalvisitTable.deletedAt), eq(jadwalvisitTable.tanggal, today))));
            const jadwalbycode = await db.select({custCd: jadwalvisitTable.custCd, kodeJadwal: jadwalvisitTable.kodeJadwal, tanggalJadwal: jadwalvisitTable.tanggal, latAkhir: jadwalvisitTable.latAkhir, longAkhir: jadwalvisitTable.longAkhir, tujuan: jadwalvisitTable.tujuan, stage: jadwalvisitTable.stage, fullName: customerTable.fullName, phone: customerTable.phone1, tier: customerTable.tier, type: customerTable.type, target: customerTable.target,  foto: customerTable.foto}).from(jadwalvisitTable).leftJoin(customerTable, eq(jadwalvisitTable.custCd, customerTable.custCode)).where(and(and(eq(jadwalvisitTable.userName, username), isNull(jadwalvisitTable.deletedAt), eq(jadwalvisitTable.tanggal, tanggal))));
            return new NextResponse(JSON.stringify(jadwalbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching jadwal visit data" + err.message, {
            status: 500,
        });      
        } 
    }
    try {
            const allJadwal = await db.select().from(jadwalvisitTable).where(isNull(jadwalvisitTable.deletedAt));
            return new NextResponse(JSON.stringify(allJadwal), { status: 200});
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

