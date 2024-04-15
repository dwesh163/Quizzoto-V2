import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { v4 as uuidv4 } from 'uuid';
import db from '/lib/mongodb';

export const authOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
	],
	pages: {
		signIn: '/auth/signin',
		error: '/auth/error',
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			try {
				const existingUser = await db.collection('users').findOne({ email: user.email });

				const newUser = {
					id: uuidv4(),
					name: profile.name ? profile.name : profile.login,
					email: user.email,
					image: user.image,
					username: profile.login,
					company: profile.company,
					location: profile.location,
					bio: profile.bio,
					statistics: {
						points: 0,
						quizzes: 0,
						stars: 0,
					},
					provider: account.provider,
					lastLogin: new Date(),
					firstLogin: existingUser ? existingUser.firstLogin : new Date(),
				};

				if (existingUser) {
					await db.collection('users').updateOne({ email: user.email }, { $set: { ...newUser, id: existingUser.id, statistics: existingUser.statistics } });
				} else {
					await db.collection('users').insertOne(newUser);
				}
				return Promise.resolve(true);
			} catch (error) {
				console.error('Error during sign-in:', error);
				return Promise.resolve(false);
			}
		},

		async session({ session, token }) {
			const user = await db.collection('users').findOne(
				{ email: session.user.email },
				{
					projection: {
						_id: 0,
						id: 1,
						name: 1,
						email: 1,
						image: 1,
						username: 1,
					},
				}
			);
			session.user = user;
			return session;
		},
	},
};

export default NextAuth(authOptions);
