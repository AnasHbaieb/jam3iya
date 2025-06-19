const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function main(){
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    })

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10)

        const admin = await prisma.user.create({
            data:{
                email:adminEmail,
                password: hashedPassword,
                name:'Admin',
                role:'ADMIN',
            },
        })
        console.log('Admin user created:',admin.email)
    } else {
        console.log('Admin user already exists')
    }
}
main()
.catch((e) => {
    console.error(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})