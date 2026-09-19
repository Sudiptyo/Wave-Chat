-- AlterTable
ALTER TABLE "stories" ALTER COLUMN "expiresAt" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '24 hours';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "about" SET DEFAULT 'Hey ! I''m using WaveChat';
