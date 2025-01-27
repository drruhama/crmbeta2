import { jadwalvisitTable, kunjunganTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { count, eq, and, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";
import { sql } from "drizzle-orm";
import { format } from 'date-fns';

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const today = format(new Date(), 'yyyy-MM-dd'); // Format current date to YYYY-MM-DD
    console.log('today is:', today);
   
    let empatharilalu = new Date();
    empatharilalu.setDate(empatharilalu.getDate() - 4);
    const fourdaysago = format(empatharilalu, 'yyyy-MM-dd')
    console.log('empat hari lalu:', fourdaysago, )
    
    if (username) {
        try {
            const visitbycode = await db.select({ hitung: count() }).from(kunjunganTable).where(and(and(eq(kunjunganTable.userName, username), isNull(kunjunganTable.deletedAt), eq(kunjunganTable.tglKunjungan, fourdaysago))));
            const { hitung } = visitbycode[0];
            return new NextResponse(JSON.stringify(hitung), { status: 200});
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
