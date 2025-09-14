require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const Note = require('./models/Note');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saas_notes';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for seeding');

  await Tenant.deleteMany({});
  await User.deleteMany({});
  await Note.deleteMany({});

  const acme = await Tenant.create({ name: 'Acme', slug: 'acme', plan: 'free' });
  const globex = await Tenant.create({ name: 'Globex', slug: 'globex', plan: 'free' });

  const p = await bcrypt.hash('password', 10);

  const adminAcme = await User.create({ email: 'admin@acme.test', passwordHash: p, role: 'Admin', tenant: acme._id });
  const userAcme = await User.create({ email: 'user@acme.test', passwordHash: p, role: 'Member', tenant: acme._id });

  const adminGlobex = await User.create({ email: 'admin@globex.test', passwordHash: p, role: 'Admin', tenant: globex._id });
  const userGlobex = await User.create({ email: 'user@globex.test', passwordHash: p, role: 'Member', tenant: globex._id });

  // sample notes (2 for acme)
  await Note.create({ title: 'Welcome to Acme', content: 'This is a sample note', tenant: acme._id, owner: adminAcme._id });
  await Note.create({ title: 'Acme Second', content: 'Another note', tenant: acme._id, owner: userAcme._id });

  // globex notes
  await Note.create({ title: 'Globex Note', content: 'Hello Globex', tenant: globex._id, owner: adminGlobex._id });

  console.log('Seed complete');
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
