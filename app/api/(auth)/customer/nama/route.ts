import { customerTable, jadwalvisitTable, salesTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";
import { sql } from "drizzle-orm";

export const GET = async ( request: Request ) => { 
    const { searchParams } = new URL(request.url);
    const kodeCustomer = searchParams.get("kodeCustomer");
    const username = searchParams.get("username");

    if (kodeCustomer) {
        try {
            const customerbycode = await db.select().from(customerTable).where(and(or(eq(customerTable.custCode, kodeCustomer),eq(customerTable.fullName, kodeCustomer)), isNull(customerTable.deletedAt)));
            return new NextResponse(JSON.stringify(customerbycode), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching customer data" + err.message, {
            status: 500,
        });      
        } 
    }
    if (username) {
    try {
            const allCustomers = await db.select({
                label: customerTable.fullName,
                value: customerTable.custCode,
                alamat: customerTable.alamat,
                lat: customerTable.lat,
                long: customerTable.longi,
            }).from(customerTable).where(and(eq(customerTable.registeredBy,username), isNull(customerTable.deletedAt)));
            return new NextResponse(JSON.stringify(allCustomers), { status: 200});
    } catch (err: any) {
        return new NextResponse("Error in fetching customer data" + err.message, {
            status: 500,
        });      
    }}
};

