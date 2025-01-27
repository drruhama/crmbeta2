import {kunjunganTable, pocustdTable, pocusthTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { sum, eq, and, isNull, like, between, arrayContains } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";
import { sql } from "drizzle-orm";
import { format, getMonth } from 'date-fns';
import { stringify } from "querystring";


export const GET = async ( request: Request, term?: string ) => { 
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
   
    let tglsekarang = new Date();
    if (username) {
            try {
               // console.log(date.getMonth());
               // console.log(month);
               // const pobycode = await db.select().from(pocusthTable).where(and(and(eq(pocusthTable.userName, username), isNull(pocusthTable.deletedAt), between(pocusthTable.tglPo,"2024-01-01","2024-01-31"))));
             //  const pobycode = await db.select().from(pocusthTable).where(and(and(eq(pocusthTable.userName, username), isNull(pocusthTable.deletedAt), like(pocusthTable.tglPo,"%2024-01-01%"))));
           // const pobycode = await db.execute(sql`select * from ${pocusthTable}`)  
           if (tglsekarang.getMonth() == 0) {
            const pobycode = await db.execute(sql`select sum(${pocustdTable.harga}*${pocustdTable.qty}) from ${pocustdTable} inner join ${pocusthTable} on ${pocusthTable.poCode}=${pocustdTable.poCode} where ${pocusthTable.userName}=${username} and ${pocusthTable.deletedAt} is null and EXTRACT('month' from ${pocusthTable.tglPo}) = EXTRACT('month' from CURRENT_DATE)+11 and EXTRACT('year' from ${pocusthTable.tglPo})= EXTRACT('year' from CURRENT_DATE)-1`);     
            const { sum } = pobycode.rows[0];  
            console.log('opsi 1');
            return new NextResponse(JSON.stringify(sum), { status: 200});
        } else {
            const pobycode = await db.execute(sql`select sum(${pocustdTable.harga}*${pocustdTable.qty}) from ${pocustdTable} inner join ${pocusthTable} on ${pocusthTable.poCode}=${pocustdTable.poCode} where ${pocusthTable.userName}=${username} and ${pocusthTable.deletedAt} is null and EXTRACT('month' from ${pocusthTable.tglPo}) = EXTRACT('month' from CURRENT_DATE)-1 and EXTRACT('year' from ${pocusthTable.tglPo})= EXTRACT('year' from CURRENT_DATE)`);    
          //  const pobycode = await db.select().from(pocusthTable).where(and(and(eq(pocusthTable.userName, username), isNull(pocusthTable.deletedAt), db.execute(sql`select * from ${pocusthTable} where EXTRACT('month' from ${pocusthTable.tglPo}) = EXTRACT('month' from CURRENT_DATE)-1 and EXTRACT('year' from ${pocusthTable.tglPo})= EXTRACT('year' from CURRENT_DATE)`)     )));
           // await  
           const { sum } = pobycode.rows[0];  
           console.log('opsi 2');
           return new NextResponse(JSON.stringify(sum), { status: 200});
        }
        } catch (err: any) {
            console.log('opsi 3');  
            return new NextResponse("Error in fetching visit data" + err.message, {
                status: 500,
            });   
             
        }
    };
}
