import { salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");
   
    if (username && password) {
        try {
        //    const salesbycode = await db.select({username: salesTable.userName, salesname: salesTable.salesName}).from(salesTable).where(and(and(eq(salesTable.userName, username), eq(salesTable.password, password)), isNull(salesTable.deletedAt)));
        const salesbycode = await db.select({namauser: salesTable.userName}).from(salesTable).where(and(and(eq(salesTable.userName, username), eq(salesTable.password, password)), isNull(salesTable.deletedAt)));
        const { namauser } = salesbycode[0];   
      //  return new NextResponse(JSON.stringify(salesbycode), { status: 200});
        return new NextResponse(JSON.stringify(namauser), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching username data" + err.message, {
            status: 500,
        });      
        } 
    }
    if (username) {
        return new NextResponse(null, { status: 200});
    }
    if (password) {
        return new NextResponse(null, { status: 200});
    }
};
