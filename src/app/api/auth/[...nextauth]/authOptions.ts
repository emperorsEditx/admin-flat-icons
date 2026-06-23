import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Get API URL with proper fallback
const getAPIUrl = () => {
  return process.env.NEST_API_URL?.replace(/\/$/, '') || 'https://flat-icons-api.awaiss.tech';
};

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // 1️⃣ Credentials login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("AUTHORIZE CALLED");
        console.log("CREDENTIALS RECEIVED:", credentials);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials: email and password are required");
        }

        try {
          const apiUrl = getAPIUrl();
          console.log("Using API URL:", apiUrl);
          
          const res = await fetch(`${apiUrl}/auth/signin`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          let data: any = null;
          try {
            data = await res.json();
          } catch (e) {
            console.error("Failed parsing JSON from Nest auth response", e);
          }

          console.log("NEST RESPONSE:", res.status, data);

          if (!res.ok) {
            const message = data?.message || data?.error || `Authentication failed (status: ${res.status})`;
            console.error("Auth failed:", message);
            throw new Error(message);
          }

          if (!data?.user) {
            throw new Error("Authentication failed: no user returned from backend");
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.accessToken,
          };
        } catch (err: any) {
          console.error("Authorize error:", err?.message || err);
          throw new Error(err?.message || "Authentication failed");
        }
      },
    }),

    // 2️⃣ Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Day (matches backend if you configure it so)
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Credentials login
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }

      // Google login (Token Exchange)
      if (account?.provider === "google") {
        try {
          const apiUrl = getAPIUrl();
          const res = await fetch(`${apiUrl}/auth/social-login`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              email: user?.email,
              name: user?.name,
              provider: "google",
              providerId: account.providerAccountId,
            }),
          });

          const data = await res.json();

          if (res.ok && data.accessToken) {
            token.accessToken = data.accessToken;
            token.id = data.user.id;
          } else {
            console.error("Social Login Failed", data);
          }
        } catch (error) {
          console.error("Social Auth Error", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin", // Your custom sign-in page
  },
};
