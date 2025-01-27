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
            const kunjunganbyjadwal = await db.select({checkout: kunjunganTable.checkoutAt}).from(kunjunganTable).where(eq(kunjunganTable.kdJadvis, kodejadwal))
            //
            const { checkout } = kunjunganbyjadwal[0];
            return new NextResponse(JSON.stringify(checkout), { status: 200});
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
