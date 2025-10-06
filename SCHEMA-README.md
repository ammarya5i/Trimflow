# Salon Ahmet Barbers Database Schema

## 📄 **Main Schema File**
- **File**: `schema.sql`
- **Database**: Neon PostgreSQL
- **Business**: Salon Ahmet Barbers, Mecidiyeköy, Istanbul

## 🎯 **What's Included**

### **Real Business Data**
- **Location**: Mecidiyeköy, Şht. Er Cihan Namlı Cd No:9 D:2B, 34387 Şişli/İstanbul
- **Phone**: +90 541 883 31 20
- **Hours**: Every day 9:00-23:45 (7 days a week)
- **Rating**: 4.9 stars from 608+ reviews
- **Instagram**: @salonahmetbarbers

### **Services**
- Model Saç Kesimi (₺200)
- Sakal Kesimi & Şekillendirme (₺150)
- Komple Bakım (₺350) - Most popular
- Tıraş & Yüz Bakımı (₺180)
- Saç Boyama (₺250)
- Doğal Kalıcı Saç Düzleştirici (₺400)
- Profesyonel Yüz Bakımları (₺300)
- Kaş Boyama (₺80)

### **Staff**
- **Ahmet Usta** - Master barber & owner (admin access)
- **Mehmet Usta** - Modern cuts specialist
- **Can Usta** - Luxury treatments expert

### **Admin Access**
- **Only Ahmet** has admin dashboard access
- **Email**: ahmet@salonahmetbarbers.com
- **All other users** are customers (no accounts needed)

## 🚀 **How to Use**

1. **Set up Neon database**
2. **Run the schema**: `schema.sql`
3. **Seed the database**: `npm run db:seed`
4. **Update DATABASE_URL** in your environment

## 📱 **Website**
- **URL**: https://salonahmetbarbers.vercel.app
- **Booking**: /s/salon-ahmet-barbers
- **Status**: ✅ Fully functional

## 🔧 **Environment Variables Needed**
```bash
DATABASE_URL="your_neon_postgresql_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="https://salonahmetbarbers.vercel.app"
```

## 📋 **Features**
- ✅ Customer-focused booking (no accounts needed)
- ✅ Real business information
- ✅ Turkish Lira pricing
- ✅ Extended hours (9:00-23:45)
- ✅ Only Ahmet has admin access
- ✅ Complete appointment request system
