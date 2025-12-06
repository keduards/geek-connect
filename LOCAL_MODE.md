# Local Database Mode

The app has been configured to use a **local database** (localStorage) instead of Supabase. This allows you to test the app without setting up Supabase.

## How It Works

- **Authentication**: Uses localStorage to store user session
- **Database**: All data stored in browser localStorage
- **Seed Data**: Automatically creates 4 mock users on first load

## Testing

1. **Start the dev server**:
   ```bash
   pnpm dev
   ```

2. **Open http://localhost:3000**

3. **Sign in**: Click "Sign in with GitHub" (creates a demo user)

4. **Complete onboarding**: Set your role and skills

5. **View matches**: See the 4 seeded mock users with match scores

6. **Test features**:
   - Create collaboration posts
   - Request intros
   - Edit your profile

## Data Storage

All data is stored in browser localStorage:
- `current_user` - Current authenticated user
- `profiles` - All user profiles
- `collab_posts` - Collaboration board posts
- `messages` - Messages between users
- `db_seeded` - Flag to prevent re-seeding

## Clearing Data

To reset all data, clear your browser's localStorage or run:
```javascript
localStorage.clear()
```

Then refresh the page to re-seed mock users.

## Switching Back to Supabase

To use Supabase instead:
1. Replace all imports of `@/lib/supabaseClient-local` with `@/lib/supabaseClient`
2. Configure `.env.local` with Supabase credentials
3. Run database migrations in Supabase
4. Re-enable middleware in `middleware.ts`

