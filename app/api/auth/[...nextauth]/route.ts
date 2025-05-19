import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 🔐 Тут можна підключити реальний бекенд або залишити мок-логіку
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin123"
        ) {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  }
  
});

export { handler as GET, handler as POST };
