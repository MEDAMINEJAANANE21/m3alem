import { connectDatabase, disconnectDatabase } from '../src/config/database.config.js';
import { ROLES } from '../src/constants/roles.constants.js';
import { Booking } from '../src/models/booking.model.js';
import { Review } from '../src/models/review.model.js';
import { Service } from '../src/models/service.model.js';
import { User } from '../src/models/user.model.js';
import { CATALOG } from './data/catalog.data.js';

const DEMO_USERS = [
  { name: 'Admin M3alem', email: 'admin@m3alem.local', role: ROLES.ADMIN },
  { name: 'Karim Prestataire', email: 'pro@m3alem.local', role: ROLES.PROVIDER, phone: '+212600000001' },
  { name: 'Salma Cliente', email: 'client@m3alem.local', role: ROLES.CLIENT, phone: '+212600000002' },
];

const DEMO_REVIEWS = [
  { authorName: 'Youssef', rating: 5, comment: 'Plombier arrivé en 1h, travail propre. Je recommande !' },
  { authorName: 'Imane', rating: 4, comment: 'Bon service de ménage, ponctuel et efficace.' },
];

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed a production database.');
  }
  const password = process.env.SEED_PASSWORD || 'Password123!';
  await connectDatabase(process.env.MONGODB_URI);

  await Promise.all([
    Booking.deleteMany({}),
    Review.deleteMany({}),
    Service.deleteMany({}),
    User.deleteMany({ email: { $in: DEMO_USERS.map((user) => user.email) } }),
  ]);

  // create() one by one so the password-hashing hook runs for each user.
  const users = [];
  for (const user of DEMO_USERS) users.push(await User.create({ ...user, password }));
  const provider = users.find((user) => user.role === ROLES.PROVIDER);

  await Service.insertMany(CATALOG.map((service) => ({ ...service, provider: provider.id })));
  await Review.insertMany(DEMO_REVIEWS);

  console.log(`Seeded ${CATALOG.length} services, ${DEMO_REVIEWS.length} reviews and demo accounts:`);
  DEMO_USERS.forEach(({ email, role }) => console.log(`  ${role.padEnd(12)} ${email}  /  ${password}`));
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
