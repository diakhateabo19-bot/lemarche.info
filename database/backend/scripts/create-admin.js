// Crée (ou met à jour) un compte administrateur dans la table Employe.
//
// Usage :
//   ADMIN_PASSWORD='...' npm run admin:rita
//   ADMIN_NOM='...' ADMIN_EMAIL='...' ADMIN_TELEPHONE='...' ADMIN_PASSWORD='...' npm run admin:create
//
// Le mot de passe n'est jamais stocké dans le dépôt : il doit être fourni
// via la variable d'environnement ADMIN_PASSWORD.
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const nom = process.env.ADMIN_NOM;
const email = process.env.ADMIN_EMAIL;
const telephone = process.env.ADMIN_TELEPHONE;
const password = process.env.ADMIN_PASSWORD;

async function main() {
  const manquants = Object.entries({
    ADMIN_NOM: nom,
    ADMIN_EMAIL: email,
    ADMIN_TELEPHONE: telephone,
    ADMIN_PASSWORD: password,
  })
    .filter(([, valeur]) => !valeur)
    .map(([cle]) => cle);

  if (manquants.length > 0) {
    throw new Error(`Variables manquantes : ${manquants.join(', ')}`);
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD doit contenir au moins 8 caractères');
  }

  const prisma = new PrismaClient();
  try {
    const hash = await bcrypt.hash(password, 10);
    const admin = await prisma.employe.upsert({
      where: { email },
      update: { nom, telephone, password: hash, role: 'ADMIN', actif: true },
      create: { nom, email, telephone, password: hash, role: 'ADMIN' },
    });
    console.log(`Compte administrateur prêt : ${admin.nom} <${admin.email}> (id ${admin.id})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
