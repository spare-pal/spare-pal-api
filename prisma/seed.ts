import { faker } from '@faker-js/faker'
import { PrismaClient, ProductStatus, ShopStatus } from '@prisma/client'

const prisma = new PrismaClient()

const fakerShop = () => ({
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  address: faker.location.streetAddress(),
  latitude: Number(faker.location.latitude()),
  longitude: Number(faker.location.longitude()),
  status: ShopStatus.ACTIVE,
  splash_image: faker.image.urlLoremFlickr({
    category: 'abstract',
  }),
})

const fakerImage = (productId: number) => ({
  product_id: productId,
  url: faker.image.urlLoremFlickr({
    category: 'transport',
  }),
  alt: faker.lorem.words(),
})

const fakerProduct = (shopId: number) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: Number(faker.commerce.price()),
  status: ProductStatus.ACTIVE,
  shop_id: shopId,
})

const fakerBanner = (shopId: number) => ({
  image: faker.image.urlLoremFlickr({
    category: 'abstract',
  }),
  title: faker.lorem.words(),
  description: faker.lorem.paragraph(),
  status: true,
  shop_id: shopId,
})

async function main() {
  console.log('Seeding data...\n')
  console.log('Seeding shops...')
  const shops = await Promise.all(
    Array.from({ length: faker.number.int({ min: 18, max: 25 }) }).map(() =>
      prisma.shop.create({ data: fakerShop() }),
    ),
  )

  console.log('Seeding products...')
  const products = (
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
  ).reduce((acc, val) => acc.concat(val), [])

  console.log('Seeding images...')
  await Promise.all(
    products.map((product) =>
      Promise.all(
        Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() =>
          prisma.image.create({
            data: fakerImage(product.id),
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
