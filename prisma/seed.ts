import { PrismaClient, ShopStatus, ProductStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const fakerShop = () => ({
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  address: faker.location.streetAddress(),
  latitude: Number(faker.location.latitude()),
  longitude: Number(faker.location.longitude()),
  status: ShopStatus.ACTIVE,
})

const fakerProduct = (shopId: number) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: Number(faker.commerce.price()),
  image: faker.image.urlLoremFlickr(),
  status: ProductStatus.ACTIVE,
  shop_id: shopId,
})

const fakerBanner = (shopId: number) => ({
  image: faker.image.urlLoremFlickr(),
  title: faker.lorem.words(),
  description: faker.lorem.paragraph(),
  status: true,
  shop_id: shopId,
})

async function main() {
  console.log('Seeding data...')
  console.log('Seeding shops...')
  const shops = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.shop.create({ data: fakerShop() }),
    ),
  )

  console.log('Seeding products...')
  await Promise.all(
    shops.map((shop) =>
      Promise.all(
        Array.from({ length: 30 }).map(() =>
          prisma.product.create({
            data: fakerProduct(shop.id),
          }),
        ),
      ),
    ),
  )

  console.log('Seeding banners...')
  await Promise.all(
    shops.map((shop) =>
      Promise.all(
        Array.from({ length: 1 }).map(() =>
          prisma.banner.create({
            data: fakerBanner(shop.id),
          }),
        ),
      ),
    ),
  )
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
