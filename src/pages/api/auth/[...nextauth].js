import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

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
					email: user.email,
					username: profile.login,
					image: user.image,
					provider: account.provider,
					company: profile.company,
					name: profile.name ? profile.name : profile.login,
				};

				if (existingUser) {
					await db.collection('users').updateOne({ email: user.email }, { $set: { ...newUser, id: existingUser.id } });
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
			const user = await db.collection('users').findOne({ email: session.user.email });
			session.user = user;
			return session;
		},
	},
};

export default NextAuth(authOptions);
