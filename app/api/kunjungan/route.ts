import { kunjunganTable} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { sql, eq, isNull } from "drizzle-orm";
import { ko } from "date-fns/locale";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodejadwal = Number(searchParams.get("kodejadwal"));
    //const today = format(new Date(), 'yyyy-MM-dd'); // Format current date to YYYY-MM-DD
   
    if (kodejadwal) {
        try {
            //const jadwalbycode = await db.select().from(jadwalvisitTable).where(and(and(eq(jadwalvisitTable.userName, username), isNull(jadwalvisitTable.deletedAt), eq(jadwalvisitTable.tanggal, today))));
            const kunjunganbyjadwal = await db.select().from(kunjunganTable).where(eq(kunjunganTable.kdJadvis, kodejadwal))
            return new NextResponse(JSON.stringify(kunjunganbyjadwal), { status: 200});
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
 // const newCanvas = await db.insert(canvasTable).values(body);
  const newVisit = await db.insert(kunjunganTable).values(body);
 // const newProject = await db.insert(projectTable).values(body);
  return new NextResponse(
    JSON.stringify({ message: "Visit data is created",  visit: newVisit}),
    { status: 200 }
   )        
} catch (error: any) {
    return new NextResponse("Error in creating a visit: " + error.message, {
        status: 500,
    });
}
};

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const kodejadwal = Number(searchParams.get("kodejadwal"));
     //   const idkunjungan = searchParams.get("idkunjungan");
        const body = await request.json();
        const { 
            kdFoto,
            latAkhir,
            longAkhir,
            checkoutAt,
            note,
            tujuanVisit,
            buktiActivity, deletedAt } = body;

        if (deletedAt) {
            const deletedKunjungan = await db
      .update(kunjunganTable)
      .set({ 
        deletedAt: sql `NOW()` })
      .where(eq(kunjunganTable.idKunjungan, idkunjungan));

        if (!deletedKunjungan) {
            return new NextResponse(JSON.stringify({ message: "Failed, delete visit"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Visit data is deleted" }), { status: 200 });
        }
        if (!kodejadwal) {
            return new NextResponse (
                JSON.stringify({ message: "Kode jadwal tidak ditemukan"}),
                { status: 400 }
            );
        }
        const updatedKunjungan = await db
      .update(kunjunganTable)
      .set({ 
        kdFoto,
        latAkhir,
        longAkhir,
        checkoutAt,
        note,
        tujuanVisit,
        buktiActivity
       })
      .where(eq(kunjunganTable.kdJadvis, kodejadwal));

        if (!updatedKunjungan) {
           // console.log(error)
            return new NextResponse(JSON.stringify({ message: "Failed, update visit"}), { status: 400 })
        }
        return new NextResponse(JSON.stringify({ message: "Visit data is updated" }), { status: 200 });
       
    } catch (error) {
        console.log (error)
        return new NextResponse(JSON.stringify({ message: "Error in delete kunjungan"}), { status: 500, });
    }
}