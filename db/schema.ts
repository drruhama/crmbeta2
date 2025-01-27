import { pgTable, text, timestamp, date, time, serial, integer, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { renderToStaticMarkup } from "react-dom/server";
import { te } from "date-fns/locale";



//mengaktifkan type data serial
export const table = pgTable('table', {
  serial: serial('serial'),
});

// struktur table dan foreign key 

export const customerTable = pgTable("customer", {
    custCode: text("cust_code").primaryKey(),
    fullName: text("full_name").notNull(),
    tier: text("tier").notNull(),
    type: text("type").notNull(),
    provinsi: text("provinsi").notNull(),
    kabKota: text("kabupaten_kota").notNull(),
    kecamatan: text("kecamatan").notNull(),
    kelurahDs: text("kelurahan_desa").notNull(),
    alamat: text("alamat").notNull(),
    lat: numeric("latitude").notNull(),
    longi: numeric("longitude").notNull(),
    phone1: text("phone1").notNull(),
    phone2: text("phone2"),
    email: text("email"),
    kdFoto: text("kd_foto").unique(),
    foto: text("foto"),
    note: text("note"),
    remark: text("remark"),
    berkas: text("berkas"),  //utk manager bisa upload berkas file2x kelengkapan customer
    target: text("sales_target"),
    registeredAt: timestamp("registered_at").notNull().defaultNow(),
    registeredBy: text("registered_by").references(() => salesTable.userName),
    approve: text("approve_state"),
    custAsign: text("cust_assign").references(() => salesTable.userName),
    deletedAt: timestamp("deleted_at")
});

export const salesTable = pgTable("sales", {
    userName: text("user_name").primaryKey().notNull(), //email terdaftar di clerck dashboard
    password: text("password").notNull(),
    salesCode: text("sales_code").unique(),
    salesName: text("sales_name").notNull(),
    jabatan: text("jabatan").notNull(),
    alamatDomisili: text("alamat_domisili").notNull(),
    alamatKtr: text("alamat_ktr").notNull(),
    cabang: text("cabang").notNull(),
    area: text("area"),
    kdFoto: text("kd_foto").unique(),
    foto: text("foto"),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at")
});

export const produkTable = pgTable("produk", {
    kodeBarang: text("kodebarang").primaryKey(),
    namaBarang: text("nama_barang").notNull(),
    hargaBarang: integer("harga"),
    hargaJual: integer("harga_jual"),
    hargaModal: integer("harga_modal"),
    hargaBeli: integer("harga_beli"),
    status: text("status"), //active atau inactive
    newCode: text("kode_brg_baru"),
    group: text("group"),
    category: text("category"), //buat tambahan field pengkategorian
    weight: integer("weight"),
    kdFoto: text("kd_foto").unique(),
    foto: text("foto"),
    note: text("note"),
    remark: text("remark"), //kalau barang baru didaftarkan otomatis kita isi "new"
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at")
});

export const canvasTable = pgTable("canvassing", {
    canvasCode: text("canvas_code").primaryKey(),//.generatedByDefaultAsIdentity({ startWith: 1000 }),
    namaCan: text("nama_can"),
    tglCanvas: date("tgl_canvas").notNull(),
    userName: text("username").notNull().references(() => salesTable.userName),
    metode: text("metode").notNull(),
    tujuan: text("tujuan"), //tujuan canvassing seperti meeting, survey, maintenance, lainya
    hasil: text("hasil"),
    custCd: text("custcd").notNull().references(() => customerTable.custCode),
    namaPic: text("nama_pic").notNull(),
    jabatanPic: text("jabatan_pic").notNull(),
    noKontak: text("no_kontak").notNull(),
    kodeProyek: text("kode_proyek"),
    idKunjungan: text("id_kunjungan"),
    note: text("note"),
    status: text("status"), //kalau sudah ada permintaan inquirynya maka status diisi 'closed'
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at")
});

export const inqheadTable = pgTable("inquiryhead", {
    inqCode: text("inquiry_code").primaryKey(),//.generatedByDefaultAsIdentity({ startWith: 50000 }),
    namaInq: text("nama_inq"),
    tglInq: date("tgl_inq").notNull(),
    userName: text("username").notNull().references(() => salesTable.userName),
    custCd: text("cust_cd").notNull().references(() => customerTable.custCode),
    namaPic: text("nama_pic").notNull(), //diambil otomatis dari jaawal kunjungan tapi bisa dioveride
    jabatanPic: text("jabatan_pic").notNull(),
    noKontak: text("no_kontak").notNull(),
    kodeProyek: text("kode_proyek"),
    idKunjungan: text("id_kunjungan"), //konek ke table Kunjungan
    note: text("note"),
    status: text("status"), //kalau sudah ada quotationya maka status disi 'closed'
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at")
});

export const inqdtTable = pgTable("inquirydata", {
    inqNo: serial("inquiry_no").primaryKey(),
    inqCode: text("inquiry_code").notNull().references(() => inqheadTable.inqCode),
    kodeBrg: text("kode_brg").references(() => produkTable.kodeBarang),
    namaBrg: text("nama_brg"), //free text opsional kalau ada barang baru atau belum terdaftar di tabel produk
    qty: integer("qty").notNull(),
    harga: integer("harga"), //inqury tidak ada harga dulu
    remark: text("remark"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    editAt: timestamp("edit_at"),
    deletedAt: timestamp("deleted_at")
});

export const quoteheadTable = pgTable("quotehead", {
    quoteCode: text("quote_code").primaryKey(),//.generatedByDefaultAsIdentity({ startWith: 700000 }),
    namaQuo: text("nama_quote"),
    tglQuote: date("tgl_quote").notNull(),
    userName: text("username").notNull().references(() => salesTable.userName),
    custCd: text("cust_cd").notNull().references(() => customerTable.custCode),
    namaPic: text("nama_pic").notNull(),
    jabatanPic: text("jabatan_pic").notNull(),
    noKontak: text("no_kontak").notNull(),
    note: text("note"),
    kodeProyek: text("kode_proyek"),
    idKunjungan: text("id_kunjungan"),
    approval: text("approval"), // default empty, no, and yes. Kalau empty bisa diedit oleh sales dan kalau no dikembalikan ke sales utk diedit atau memang engga disetujui
    approveAt: timestamp("approve_at"),
    discount: integer("discount"),
    vat: integer("vat"),
    total: integer("total"), //tidak terpakai
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at")
});

export const quotedtTable = pgTable("quotedt", {
    quoteNo: serial("quote_no").primaryKey(),
    quoteCode: text("quote_code").notNull().references(() => quoteheadTable.quoteCode),
    kodeBrg: text("kode_brg").references(() => produkTable.kodeBarang),
    namaBrg: text("nama_brg"), //free text opsional kalau ada barang baru atau belum terdaftar di tabel produk
    qty: integer("qty").notNull(),
    harga: integer("harga"),
    remark: text("remark"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    editAt: timestamp("edit_at"),
    deletedAt: timestamp("deleted_at")
});

export const pocusthTable = pgTable("pocusthead", {
    
    poCode: text("po_code").primaryKey(),//.generatedByDefaultAsIdentity({ startWith: 9000000 }), ini diisi no po dari customer
    namaPo: text("nama_po"),
    nomorPo: text("nomor_po").notNull().unique(),
    tglPo: date("tgl_po"),
    payment: text("payment").notNull(), //cara bayar
    delivery: text("delievery"), //cara kirim
    userName: text("username").notNull().references(() => salesTable.userName),
    custCd: text("cust_cd").notNull().references(() => customerTable.custCode),
    namaPic: text("nama_pic").notNull(),
    jabatanPic: text("jabatan_pic").notNull(),
    noKontak: text("no_kontak").notNull(),
    note: text("note"),
    kodeProyek: text("kode_proyek"),
    idKunjungan: text("id_kunjungan"),
    approval: text("approval"),
    approveAt: timestamp("approve_at"),
    noSO: text("so_num"), //bisa diupdate sales setelah approval dan diinput ke SAP dapat no SO 
    discount: integer("discount"),
    vat: integer("vat"), //opsi nilaix11% atau x12% dan bisa di overide andaikata ada perubahan nilai vatnya
    total: integer("total"),//tdk dipakai
    remark: text("remark"),
    quoteCode:text("quote_code"), //tdk terpakai karena sudah ada kdproyek yg menghubungkan
    status: text("status"), //status apakah PO dari Proyek (kosong) atau non Proyek (diisi: 'nonproyek') tdk terpakai
    berkas: text("berkas"), //apabila tanpa project maka bisa langsung buat PO maka berkas bisa langsung diupload disini dan bisa dikasih remark keteranganya diisi apa silahkan
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at")
});

export const pocustdTable = pgTable("pocustdata", {
    poNo: serial("po_no").primaryKey(),
    poCode: text("po_code").notNull().references(() => pocusthTable.poCode),
    kodeBrg: text("kode_brg").references(() => produkTable.kodeBarang),
    namaBrg: text("nama_brg"), //free text opsional kalau ada barang baru atau belum terdaftar di tabel produk
    qty: integer("qty").notNull(),
    refundQty: integer("refund_qty"),
    replaceQty: integer("replace_qty"),
    harga: integer("harga"),
    remark: text("remark"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    editAt: timestamp("edit_at"),
    deletedAt: timestamp("deleted_at")
});

export const projectTable = pgTable("project", {
    kodeProyek: text("kode_proyek").primaryKey(),
    nama: text("nama").notNull(),
    tanggal: date("tanggal").notNull(),
    userName: text("username").notNull().references(() => salesTable.userName),
    stage: text("stage").notNull(), //canvas, inq, quote, po
    jenisTransac: text("jenis_transac"), //Retail, Project, OM (Operation and Maintenance), Other
    canvasCd: text("canvas_cd").references(() => canvasTable.canvasCode),
    inqCd: text("inq_cd").references(() => inqheadTable.inqCode),
    quoteCd: text("quote_cd").references(() => quoteheadTable.quoteCode),
    poCd: text("po_cd").references(() => pocusthTable.poCode),
    targetProyek: integer("target_proyek"),
    note: text("note"),
    sample: text("sample"),
    remark: text("remark"),
    berkas: text("berkas"), //url berkas kelengkapan hanya bisa diupload oleh manager dari mode web karena pakai cloudinary nanti
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
    closedAt: timestamp("closed_at"),
});

export const jadwalvisitTable = pgTable("jadwalvisit", {
    kodeJadwal: integer("kode_jadwal").primaryKey().generatedByDefaultAsIdentity({ startWith: 1000 }),
    tanggal: date("tanggal").notNull(),
    waktu: time("waktu"),
    userName: text("username").notNull().references(() => salesTable.userName),
    tujuan: text("tujuan").notNull(), //alamat customer otomatis dari data alamat customer
    repeat: text("repeat"),
    routeName: text("route_name"),
    latAwal: numeric("lat_awal"),
    longAwal: numeric("long_awal"),
    latAkhir: numeric("lat_akhir"),   //otomatis dari data customer
    longAkhir: numeric("long_akhir"), //otomatis dari data customer
    note: text("note"),
    custCd: text("cust_code").notNull().references(() => customerTable.custCode),
    stage: text("stage"),
    realisasi: text("realisasi"),
    alasan: text("alasan"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at")
});

//buat bisa banyak foto pada satu kd foto cust atau
export const albumTable = pgTable("album", {
  noFoto: text("no_foto").primaryKey(),
  kdFotoCust: text("kd_foto_cust").references(() => customerTable.kdFoto),
  kdFotoSales: text("kd_foto_sal").references(() => salesTable.kdFoto),
  kdFotoBrg: text("kd_foto_bar").references(() => produkTable.kdFoto),
  kdFotoVisit: text("kd_foto_vis").references(() => kunjunganTable.kdFoto),
  alamat: text("status").notNull(),
  deskripsi: text("deskripsi"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at")
});

//utk kunjungan masing2x stage bisa lebih dari 1 kunjungan tiap stage
export const kunjunganTable = pgTable("kunjungan", {
  idKunjungan: text("id_kunjungan").primaryKey(),//.generatedByDefaultAsIdentity({ startWith: 1000 }),
  tglKunjungan: date("tgl_kunjungan").notNull(), //buat defaultnya now nanti di codingnya karena engga bisa dari table langsung
 // waktuKunjungan: time("waktu_kunjungan").notNull(), //sama buat default now di codingnya
  userName: text("username").notNull().references(() => salesTable.userName),
  custCd: text("cust_code").notNull().references(() => customerTable.custCode),
  stage: text("stage").notNull(), // canvass, inq, quote, or po
  canvasCode: text("kode_canvas").references(() => canvasTable.canvasCode), //mengambil data dari masing2x stage
  inqCode: text("kode_inq").references(() => inqheadTable.inqCode),
  quoteCode: text("kode_quote").references(() => quoteheadTable.quoteCode),
  poCode: text("kode_po").references(() => pocusthTable.poCode),
  deskripsi: text("deskripsi"),
  tujuanVisit: text("tujuan_visit").notNull(), //otomatis alamat dari customer yg dikunjungi tapi bisa di overide kalau berubah
  hasilVisit: text("hasil_visit"), //dikosongkan saja utk canvass
  personVisited: text("person_visited"), //dikosongkan
  kdFoto: text("kd_foto").unique(),  //otomatis dari kd stage 
  buktiActivity: text("bukti_activity"), //buatkan ambil foto ditempat tanpa ambil gambar dalam hp
  kdJadvis: integer("kdjadvisit").unique().references(() => jadwalvisitTable.kodeJadwal), //otomatis dari route form sebelumnya
  note: text("note"), //dikosongkan
  checkinAt: text("checkin_at"), //buat tombol checkin visit otomatis membaca waktu saat itu ditekan dan geotaggingnya
  checkoutAt: text("checkout_at"), //buat tombol selesai kunjungan otomatis membaca waktu saat itu ditekan dan geotanggingnya
  latAwal: numeric("lat_awal"), //dah dibuat diatas
  longAwal: numeric("long_awal"), //dah dibuat diatas
  latAkhir: numeric("lat_akhir"), //dah dibuat diatas
  longAkhir: numeric("long_akhir"), //dah dibuat diatas
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at")
});

export const roleTable = pgTable("role", {
  role: text("role").primaryKey(), //sales, manager cabang, manager regional, direktur, super admin
  tingkat: integer("tingkat"), //kalau  tingkat 1 itu sales, tingkat 2 manager approve sampai 10jt, tingkat 3 direktur diatas 10jt dan dibawahnya
  limitKredit: integer("kredit_limit"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at")
});

export const workcalTable = pgTable("workcal", {
    id: serial("id").primaryKey(),
    tanggal: date("tanggal").unique(),
    status: text("status"),
    note: text("note")
});

// relasi kunjungan 
export const canvasvisitRelations = relations(canvasTable, ({ many }) => ({
  kunjungan: many(kunjunganTable),
}));

export const visitcanvasRelations = relations(kunjunganTable, ({ one }) => ({
  canvassing: one(canvasTable, {
    fields: [kunjunganTable.canvasCode],
    references: [canvasTable.canvasCode],
  }),
}));

export const inqvisitRelations = relations(inqheadTable, ({ many }) => ({
  kunjungan: many(kunjunganTable),
}));

export const visitinqRelations = relations(kunjunganTable, ({ one }) => ({
  inquiry: one(inqheadTable, {
    fields: [kunjunganTable.inqCode],
    references: [inqheadTable.inqCode],
  }),
}));

export const quotevisitRelations = relations(quoteheadTable, ({ many }) => ({
  kunjungan: many(kunjunganTable),
}));

export const visitquoteRelations = relations(kunjunganTable, ({ one }) => ({
  quotes: one(quoteheadTable, {
    fields: [kunjunganTable.quoteCode],
    references: [quoteheadTable.quoteCode],
  }),
}));

export const povisitRelations = relations(pocusthTable, ({ many }) => ({
  kunjungan: many(kunjunganTable),
}));

export const visitpoRelations = relations(kunjunganTable, ({ one }) => ({
  po: one(pocusthTable, {
    fields: [kunjunganTable.poCode],
    references: [pocusthTable.poCode],
  }),
}));

export const visitjadwalRelations = relations(kunjunganTable, ({ one }) => ({
  customer: one(jadwalvisitTable, {
    fields: [kunjunganTable.kdJadvis],
    references: [jadwalvisitTable.kodeJadwal],
  }),
}));

// relasi kd foto

export const custalbumRelations = relations(customerTable, ({ many }) => ({
  album: many(albumTable),
}));

export const albumcustRelations = relations(albumTable, ({ one }) => ({
  customer: one(customerTable, {
    fields: [albumTable.kdFotoCust],
    references: [customerTable.kdFoto],
  }),
}));

export const salesalbumRelations = relations(salesTable, ({ many }) => ({
  album: many(albumTable),
}));

export const albumsalesRelations = relations(albumTable, ({ one }) => ({
  sales: one(salesTable, {
    fields: [albumTable.kdFotoSales],
    references: [salesTable.kdFoto],
  }),
}));

export const albumprodRelations = relations(albumTable, ({ one }) => ({
  produk: one(produkTable, {
    fields: [albumTable.kdFotoBrg],
    references: [produkTable.kdFoto],
  }),
}));

export const visitalbumRelations = relations(kunjunganTable, ({ many }) => ({
  album: many(albumTable),
}));

export const albumvisitRelations = relations(albumTable, ({ one }) => ({
  produk: one(kunjunganTable, {
    fields: [albumTable.kdFotoBrg],
    references: [kunjunganTable.kdFoto],
  }),
}));

// relasi kd customer

export const custcanvRelations = relations(customerTable, ({ many }) => ({
    canvassing: many(canvasTable),
  }));

export const canvcustRelations = relations(canvasTable, ({ one }) => ({
    customer: one(customerTable, {
      fields: [canvasTable.custCd],
      references: [customerTable.custCode],
    }),
}));

export const custinqRelations = relations(customerTable, ({ many }) => ({
    inquiry: many(inqheadTable),
  }));

export const inqcustRelations = relations(inqheadTable, ({ one }) => ({
    customer: one(customerTable, {
      fields: [inqheadTable.custCd],
      references: [customerTable.custCode],
    }),
}));

export const custquoteRelations = relations(customerTable, ({ many }) => ({
    quotations: many(quoteheadTable),
  }));

export const quotecustRelations = relations(quoteheadTable, ({ one }) => ({
    customer: one(customerTable, {  
        fields: [quoteheadTable.custCd],
      references: [customerTable.custCode],
    }),
}));

export const custpoRelations = relations(customerTable, ({ many }) => ({
    po: many(pocusthTable),
  }));

export const pocustRelations = relations(pocusthTable, ({ one }) => ({
    customer: one(customerTable, {
      fields: [pocusthTable.custCd],
      references: [customerTable.custCode],
    }),
}));

export const custjadRelations = relations(customerTable, ({ many }) => ({
    jadwalvisit: many(jadwalvisitTable),
  }));

export const jadcustRelations = relations(jadwalvisitTable, ({ one }) => ({
    customer: one(customerTable, {
      fields: [jadwalvisitTable.custCd],
      references: [customerTable.custCode],
    }),
}));

// relasi kd sales

export const salescanvRelations = relations(salesTable, ({ many }) => ({
    canvassing: many(canvasTable),
  }));

export const canvsalesRelations = relations(canvasTable, ({ one }) => ({
    sales: one(salesTable, {
      fields: [canvasTable.userName],
      references: [salesTable.userName],
    }),
}));

export const salesinqRelations = relations(salesTable, ({ many }) => ({
    inquiry: many(inqheadTable),
  }));

export const inqsalesRelations = relations(inqheadTable, ({ one }) => ({
    sales: one(salesTable, {
      fields: [inqheadTable.userName],
      references: [salesTable.userName],
    }),
}));

export const salesquoteRelations = relations(salesTable, ({ many }) => ({
    quotations: many(quoteheadTable),
  }));

export const quotesalesRelations = relations(quoteheadTable, ({ one }) => ({
    sales: one(salesTable, {  
        fields: [quoteheadTable.userName],
      references: [salesTable.userName],
    }),
}));

export const salespoRelations = relations(salesTable, ({ many }) => ({
    po: many(pocusthTable),
  }));

export const posalesRelations = relations(pocusthTable, ({ one }) => ({
    sales: one(salesTable, {
      fields: [pocusthTable.userName],
      references: [salesTable.userName],
    }),
}));

export const salesjadRelations = relations(salesTable, ({ many }) => ({
    jadwalvisit: many(jadwalvisitTable),
  }));

export const jadsalesRelations = relations(jadwalvisitTable, ({ one }) => ({
    sales: one(salesTable, {
      fields: [jadwalvisitTable.userName],
      references: [salesTable.userName],
    }),
}));

export const salescustRelations = relations(salesTable, ({ many }) => ({
  customers: many(customerTable),
}));

export const custsalesRelations = relations(customerTable, ({ one }) => ({
  sales: one(salesTable, {
    fields: [customerTable.custAsign],
    references: [salesTable.userName],
  }),
}));

export const salesprojRelations = relations(salesTable, ({ many }) => ({
  customers: many(projectTable),
}));

export const projsalesRelations = relations(projectTable, ({ one }) => ({
  sales: one(salesTable, {
    fields: [projectTable.userName],
    references: [salesTable.userName],
  }),
}));

//relasi kd barang

export const produkinqRelations = relations(produkTable, ({ many }) => ({
    inquiries: many(inqdtTable),
  }));

export const inqprodukRelations = relations(inqdtTable, ({ one }) => ({
    produk: one(produkTable, {
      fields: [inqdtTable.kodeBrg],
      references: [produkTable.kodeBarang],
    }),
}));

export const produkquoteRelations = relations(produkTable, ({ many }) => ({
    quotations: many(quotedtTable),
  }));

export const quoteprodukRelations = relations(quotedtTable, ({ one }) => ({
    produk: one(produkTable, {
      fields: [quotedtTable.kodeBrg],
      references: [produkTable.kodeBarang],
    }),
}));

export const produkpoRelations = relations(produkTable, ({ many }) => ({
    pocustomer: many(pocustdTable),
  }));

export const poprodukRelations = relations(pocustdTable, ({ one }) => ({
    produk: one(produkTable, {
      fields: [pocustdTable.kodeBrg],
      references: [produkTable.kodeBarang],
    }),
}));

//relasi one to one project

export const projcanRelations = relations(projectTable, ({ one }) => ({
  canvass: one(canvasTable, {
    fields: [projectTable.canvasCd],
    references: [canvasTable.canvasCode],
  }),
}));

export const projinqRelations = relations(projectTable, ({ one }) => ({
  inquiry: one(inqheadTable, {
    fields: [projectTable.inqCd],
    references: [inqheadTable.inqCode],
  }),
}));

export const projquoteRelations = relations(projectTable, ({ one }) => ({
  quotation: one(quoteheadTable, {
    fields: [projectTable.quoteCd],
    references: [quoteheadTable.quoteCode],
  }),
}));

export const projpoRelations = relations(projectTable, ({ one }) => ({
  po: one(pocusthTable, {
    fields: [projectTable.poCd],
    references: [pocusthTable.poCode],
  }),
}));

//relasi one to many header ke detail 

export const inqRelations = relations(inqheadTable, ({ many }) => ({
  detail: many(inqdtTable),
}));

export const detailinqRelations = relations(inqdtTable, ({ one }) => ({
  header: one(inqheadTable, {
    fields: [inqdtTable.inqCode],
    references: [inqheadTable.inqCode],
  }),
}));

export const quoteRelations = relations(quoteheadTable, ({ many }) => ({
  detail: many(quotedtTable),
}));

export const detailquoteRelations = relations(quotedtTable, ({ one }) => ({
  header: one(quoteheadTable, {
    fields: [quotedtTable.quoteCode],
    references: [quoteheadTable.quoteCode],
  }),
})); 

export const poRelations = relations(pocusthTable, ({ many }) => ({
  detail: many(pocustdTable),
}));

export const detailpoRelations = relations(pocustdTable, ({ one }) => ({
  header: one(pocusthTable, {
    fields: [pocustdTable.poCode],
    references: [pocusthTable.poCode],
  }),
}));