import { canvasTable, customerTable, inqheadTable, jadwalvisitTable, kunjunganTable, pocusthTable, projectTable, quoteheadTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { ilike, sql, eq, and, or, isNull } from "drizzle-orm";
import { date } from "drizzle-orm/pg-core";
import { error } from "console";

export const GET = async ( request: Request ) => { 
    
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    const custCode = searchParams.get("custCode");
 //   const namapo = searchParams.get("namaPo");
  //  const nomorpo = searchParams.get("nomorPo");
  //  const kodeSales = searchParams.get("kodeSales");
  if (custCode) {  
    try {
        const custbycode = await db.select({ fullName: customerTable.fullName, alamat: customerTable.alamat, phone: customerTable.phone1, stage: jadwalvisitTable.stage, jadwal: jadwalvisitTable.tanggal, tanggalvisit: kunjunganTable.tglKunjungan, foto: kunjunganTable.buktiActivity, latitude: kunjunganTable.latAkhir, longitude: kunjunganTable.longAkhir, namaCan: canvasTable.namaCan, picCan: canvasTable.namaPic, jabatanCan: canvasTable.jabatanPic, kontakCan: canvasTable.noKontak, namaInq: inqheadTable.namaInq, picInq: inqheadTable.namaPic, jabatanInq: inqheadTable.jabatanPic, kontakInq: inqheadTable.noKontak, namaQuo: quoteheadTable.namaQuo, picQuo: quoteheadTable.namaPic, jabatanQuo: quoteheadTable.jabatanPic, kontakQuo: quoteheadTable.noKontak, namaPo: pocusthTable.namaPo, picPo: pocusthTable.namaPic, jabatanPo: pocusthTable.jabatanPic, kontakPo: pocusthTable.noKontak}).from(customerTable).fullJoin(jadwalvisitTable, eq(customerTable.custCode, jadwalvisitTable.custCd)).leftJoin(kunjunganTable, eq(jadwalvisitTable.kodeJadwal, kunjunganTable.kdJadvis)).leftJoin(canvasTable, eq(kunjunganTable.idKunjungan, canvasTable.idKunjungan)).leftJoin(inqheadTable, eq(kunjunganTable.idKunjungan, inqheadTable.idKunjungan)).leftJoin(quoteheadTable, eq(kunjunganTable.idKunjungan, quoteheadTable.idKunjungan)).leftJoin(pocusthTable, eq(kunjunganTable.idKunjungan, pocusthTable.idKunjungan)).where(ilike(customerTable.custCode, "%"+custCode+"%"));
        return new NextResponse(JSON.stringify(custbycode), { status: 200});
    } catch (err: any) {
    return new NextResponse("Error in fetching customer data" + err.message, {
        status: 500,
    });      
    }    
  }
   
    if (userName) {
        try {
            const custbycode2 = await db.select({ fullName: customerTable.fullName, alamat: customerTable.alamat, phone: customerTable.phone1, stage: jadwalvisitTable.stage, jadwal: jadwalvisitTable.tanggal, tanggalvisit: kunjunganTable.tglKunjungan, foto: kunjunganTable.buktiActivity, latitude: kunjunganTable.latAkhir, longitude: kunjunganTable.longAkhir, namaCan: canvasTable.namaCan, picCan: canvasTable.namaPic, jabatanCan: canvasTable.jabatanPic, kontakCan: canvasTable.noKontak, namaInq: inqheadTable.namaInq, picInq: inqheadTable.namaPic, jabatanInq: inqheadTable.jabatanPic, kontakInq: inqheadTable.noKontak, namaQuo: quoteheadTable.namaQuo, picQuo: quoteheadTable.namaPic, jabatanQuo: quoteheadTable.jabatanPic, kontakQuo: quoteheadTable.noKontak, namaPo: pocusthTable.namaPo, picPo: pocusthTable.namaPic, jabatanPo: pocusthTable.jabatanPic, kontakPo: pocusthTable.noKontak}).from(customerTable).fullJoin(jadwalvisitTable, eq(customerTable.custCode, jadwalvisitTable.custCd)).leftJoin(kunjunganTable, eq(jadwalvisitTable.kodeJadwal, kunjunganTable.kdJadvis)).leftJoin(canvasTable, eq(kunjunganTable.idKunjungan, canvasTable.idKunjungan)).leftJoin(inqheadTable, eq(kunjunganTable.idKunjungan, inqheadTable.idKunjungan)).leftJoin(quoteheadTable, eq(kunjunganTable.idKunjungan, quoteheadTable.idKunjungan)).leftJoin(pocusthTable, eq(kunjunganTable.idKunjungan, pocusthTable.idKunjungan)).where(and(ilike(customerTable.registeredBy, "%"+userName+"%"), isNull(customerTable.deletedAt)));
            return new NextResponse(JSON.stringify(custbycode2), { status: 200});
        } catch (err: any) {
        return new NextResponse("Error in fetching customer data" + err.message, {
            status: 500,
        });      
        }   
    }
};
