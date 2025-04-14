import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: 'Ov23liG6Mb4TQwZ4Ni7T',
      clientSecret: '1dc87e0f7497dfd82b9fa643b84dddcf303412cf',
    }),
  ],
  secret : 'testno1',
  adapter : MongoDBAdapter(connectDB)
};
export default NextAuth(authOptions); 