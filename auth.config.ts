import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      const isOnAddFriend = nextUrl.pathname.startsWith('/addFriend');

      //const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      //if (isOnDashboard) {
      //  if (isLoggedIn) return true;
      //  return false; // Redirect unauthenticated users to login page
      //}

      if (isOnAddFriend && !isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
      } 
      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.name = token.user.username;
      session.user.id = token.user.id;
      return session
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
