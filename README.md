# lemarche.info
Application de gestion de stock et ventes multi-magasins pour Le Marché

## Compte administrateur de Rita

Depuis `database/backend`, avec `DATABASE_URL` pointant vers la base :

```bash
npm run prisma:generate
ADMIN_TELEPHONE='77xxxxxxx' ADMIN_PASSWORD='un-mot-de-passe-solide' npm run admin:rita
```

Crée (ou met à jour) l'employé `Rita <rita@lemarche.sn>` avec le rôle `ADMIN`.
`ADMIN_NOM` et `ADMIN_EMAIL` peuvent être surchargés ; `npm run admin:create`
crée n'importe quel autre administrateur. Le mot de passe (8 caractères min.)
n'est jamais enregistré dans le dépôt.
