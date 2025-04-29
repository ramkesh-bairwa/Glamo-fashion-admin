import { faker } from '@faker-js/faker';
import { query } from "@/lib/db"
console.log(456);

// Function to generate a single fake user
function generateFakeUser() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(), // In a real application, hash the password before storing
    role: faker.helpers.arrayElement(['admin', 'user']),
  };
}

// Function to insert fake users into the database
async function seedUsers(count: number) {
  const users = Array.from({ length: count }, generateFakeUser);

  for (const user of users) {
    await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [user.name, user.email, user.password, user.role]
    );
  }

  console.log(`${count} fake users inserted successfully.`);
}

// Seed 10 fake users
seedUsers(10).catch((err) => {
  console.error('Error seeding users:', err);
});
