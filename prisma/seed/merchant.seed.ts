import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function seedMerchantsAndCatalogs(prisma: PrismaClient) {
  const password = await bcrypt.hash("testing123", 10);

  const merchantsData = [
    {
      email: "merchant@ets.com",
      title: "Ayam Goreng Berkah Pak Mul - Tebet",
      rating: 5,
      address: "Jl. Tebet Barat Dalam Raya No. 42, Jakarta Selatan",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Paket Ayam Goreng Kremes + Nasi Gurih",
          price: 36000,
          category: "Ayam & Bebek",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Ayam Bakar Madu Pedas Manis Potong 4",
          price: 42000,
          category: "Ayam & Bebek",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Bebek Goreng Sambal Korek Super Pedas",
          price: 48000,
          category: "Ayam & Bebek",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Es Jeruk Kelapa Muda Murni Segar",
          price: 16000,
          category: "Minuman",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Tahu & Tempe Bacem Legit (Isi 4)",
          price: 14000,
          category: "Camilan",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.kenangan@ets.com",
      title: "Kopi Kenangan Mantan - Sukolilo",
      rating: 5,
      address: "Jl. Raya ITS No. 12, Sukolilo, Surabaya",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Kopi Kenangan Mantan Gula Aren",
          price: 19000,
          category: "Kopi",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Avocado Coffee Float Premium",
          price: 28000,
          category: "Kopi",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Earl Grey Tea Macchiato",
          price: 22000,
          category: "Minuman",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Toast Roti Cokelat Klasik Lumer",
          price: 18000,
          category: "Camilan",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.satesenayan@ets.com",
      title: "Sate Khas Senayan Express",
      rating: 5,
      address: "Jl. Senayan Utama No. 88, Kebayoran Baru, Jakarta Selatan",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Sate Ayam Campur Bumbu Kacang Kental (10 Tusuk)",
          price: 45000,
          category: "Sate",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Sate Kambing Muda Bumbu Kecap Rawit",
          price: 68000,
          category: "Sate",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Tahu Telur Petis Gurih Khas Surabaya",
          price: 32000,
          category: "Tradisional",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Lontong Cap Go Meh Komplit",
          price: 52000,
          category: "Nasi & Lontong",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.sinjay@ets.com",
      title: "Bebek Sinjay Madura Juara",
      rating: 5,
      address: "Jl. Ketintang Baru No. 15, Gayungan, Surabaya",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Paket Bebek Goreng Kremes Serundeng + Sambal Pencit",
          price: 39000,
          category: "Ayam & Bebek",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Ayam Goreng Rempah Madura Sambal Mangga",
          price: 32000,
          category: "Ayam & Bebek",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Nasi Putih Pulen Hangat Daun Pisang",
          price: 6000,
          category: "Nasi & Lontong",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Es Sinom Segar Tradisional Asli",
          price: 10000,
          category: "Minuman",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.martabakorins@ets.com",
      title: "Martabak Orins Pecenongan",
      rating: 5,
      address: "Jl. Pecenongan No. 45, Gambir, Jakarta Pusat",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Martabak Manis Spesial Keju Kraft & Cokelat Nutella",
          price: 65000,
          category: "Martabak",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Martabak Telur Daging Sapi Cincang Spesial Bebek",
          price: 58000,
          category: "Martabak",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Martabak Tipis Kering Cokelat Keju Renyah",
          price: 35000,
          category: "Camilan",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.geprekbensu@ets.com",
      title: "Geprek Bensu Pedas Nampol",
      rating: 4,
      address: "Jl. Manyar Kertoarjo No. 23, Surabaya",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Paket Geprek Bensu Leleh Keju Mozarella Level 5",
          price: 33000,
          category: "Ayam & Bebek",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Paket Geprek Sambal Matah Segar Khas Bali",
          price: 29000,
          category: "Ayam & Bebek",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Jamur Krispi Bumbu Tabur Balado",
          price: 15000,
          category: "Camilan",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.gacoan@ets.com",
      title: "Mie Gacoan Level Setan",
      rating: 5,
      address: "Jl. Raya Gubeng No. 101, Gubeng, Surabaya",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Mie Hompimpa Pedas Gurih Asin Level 3",
          price: 16000,
          category: "Mie",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Mie Gacoan Pedas Manis Karamel Level 6",
          price: 16000,
          category: "Mie",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Dimsum Siomay Ayam Udang Lembut (4 Pcs)",
          price: 15000,
          category: "Camilan",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Pangsit Goreng Udang Renyah Saus Asam Manis",
          price: 15000,
          category: "Camilan",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Es Genderuwo Cincau Segar Buah Leci",
          price: 12000,
          category: "Minuman",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.sederhana@ets.com",
      title: "Nasi Padang Sederhana Bintaro",
      rating: 5,
      address: "Jl. Bintaro Utama Sektor 3A, Tangerang Selatan",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Paket Nasi Rendang Daging Sapi Empuk Legit",
          price: 38000,
          category: "Nasi",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Ayam Pop Gurih Minyak Kelapa Saus Merah",
          price: 27000,
          category: "Ayam & Bebek",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Gulai Tunjang Urat Sapi Kuah Kental Gurih",
          price: 36000,
          category: "Daging",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Perkedel Kentang Padang Daging Cincang",
          price: 8000,
          category: "Camilan",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.kwetiau@ets.com",
      title: "Kwetiau Sapi Mangga Besar",
      rating: 5,
      address: "Jl. Mangga Besar Raya No. 78, Taman Sari, Jakarta Barat",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Kwetiau Goreng Sapi Spesial Telur Bebek",
          price: 48000,
          category: "Mie & Kwetiau",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Kwetiau Siram Kuah Telur Kental Daging Sapi",
          price: 50000,
          category: "Mie & Kwetiau",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Bakso Sapi Urat Kuah Kaldu Bening Gurih",
          price: 35000,
          category: "Sup & Bakso",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
    {
      email: "merchant.saladstop@ets.com",
      title: "SaladStop! Green Healthy Bowl",
      rating: 5,
      address: "Jl. HR Muhammad No. 56, Sukomanunggal, Surabaya",
      status: true,
      imageUrl:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
      catalogs: [
        {
          title: "Hail Caesar Signature Warm Salad Bowl",
          price: 75000,
          category: "Healthy Salad",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Tuna San Crunchy Bowl Wonton Dressing",
          price: 85000,
          category: "Healthy Salad",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        },
        {
          title: "Cold-Pressed Green Power Detox Juice",
          price: 38000,
          category: "Minuman",
          status: true,
          imageUrl:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },
  ];

  let totalCatalogs = 0;
  const createdMerchants = [];
  const createdCatalogs = [];

  for (const m of merchantsData) {
    const merchant = await prisma.merchant.upsert({
      where: { email: m.email },
      update: {
        title: m.title,
        password,
        rating: m.rating,
        address: m.address,
        status: m.status,
        imageUrl: m.imageUrl,
      },
      create: {
        email: m.email,
        title: m.title,
        password,
        rating: m.rating,
        address: m.address,
        status: m.status,
        imageUrl: m.imageUrl,
      },
    });

    createdMerchants.push(merchant);

    for (const cat of m.catalogs) {
      // Find or create catalog by title + merchantId
      const existing = await prisma.catalog.findFirst({
        where: {
          merchantId: merchant.id,
          title: cat.title,
        },
      });

      let catalog;
      if (existing) {
        catalog = await prisma.catalog.update({
          where: { id: existing.id },
          data: {
            price: cat.price,
            category: cat.category,
            status: cat.status,
            imageUrl: cat.imageUrl,
          },
        });
      } else {
        catalog = await prisma.catalog.create({
          data: {
            merchantId: merchant.id,
            title: cat.title,
            price: cat.price,
            category: cat.category,
            status: cat.status,
            imageUrl: cat.imageUrl,
          },
        });
      }
      createdCatalogs.push(catalog);
      totalCatalogs++;
    }
  }

  console.log(
    `✅ Seeded ${merchantsData.length} merchants and ${totalCatalogs} catalog items with password: testing123`,
  );

  // Seed sample orders & transactions
  await seedSampleOrders(prisma, createdMerchants, createdCatalogs);
}

async function seedSampleOrders(
  prisma: PrismaClient,
  merchants: any[],
  catalogs: any[],
) {
  const users = await prisma.users.findMany({ take: 5 });
  const drivers = await prisma.driver.findMany({ take: 5 });

  if (users.length === 0 || merchants.length === 0 || catalogs.length === 0) {
    return;
  }

  const orderStatuses = [
    "waiting",
    "waiting",
    "picked",
    "picked",
    "delivered",
    "delivered",
    "delivered",
  ];

  for (let i = 0; i < 7; i++) {
    const user = users[i % users.length];
    const merchant = merchants[i % merchants.length];
    const driver = drivers[i % drivers.length];
    const status = orderStatuses[i];

    // Find catalog of this merchant
    const merchantCatalogs = catalogs.filter((c) => c.merchantId === merchant.id);
    const chosenCatalog = merchantCatalogs[0] || catalogs[0];

    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        merchantId: merchant.id,
        deliveryAddress: `Jl. Pelanggan Setia No. ${i + 10}, Surabaya`,
      },
    });

    if (!existingOrder) {
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          merchantId: merchant.id,
          driverId: status !== "waiting" ? driver?.id : null,
          status,
          deliveryAddress: `Jl. Pelanggan Setia No. ${i + 10}, Surabaya`,
          orderItems: {
            create: [
              {
                catalogId: chosenCatalog.id,
                quantity: 2,
                priceSnapshot: chosenCatalog.price,
              },
            ],
          },
          transaction: {
            create: {
              status: status === "delivered" ? "success" : "pending",
              grossAmount: chosenCatalog.price * 2 + 12000, // item price + delivery
              paidAt: status === "delivered" ? new Date() : null,
            },
          },
        },
      });
    }
  }

  console.log("✅ Seeded sample live orders and transactions");
}
