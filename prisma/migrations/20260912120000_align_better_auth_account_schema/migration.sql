-- Better Auth creates OAuth accounts with providerId and accountId.
-- issuer is retained for compatibility with existing rows but is not required.
ALTER TABLE "account" ALTER COLUMN "issuer" DROP NOT NULL;

DROP INDEX IF EXISTS "account_issuer_accountId_uidx";

CREATE UNIQUE INDEX "account_providerId_accountId_key"
ON "account"("providerId", "accountId");