module.exports = {
	secret: "ho845decgnbjk989i079t55$$@N>HJHH*",
	ids : {
		github: {
			APP_ID: 'get_your_own',
			APP_SECRET: 'get_your_own',
			callbackURL: "http://127.0.0.1:3003/auth/github/callback",
		},
		google: {
			APP_ID: '586155954929-m97mht8fe5sm5ua26pjbu3bkij22p8i0.apps.googleusercontent.com',
			APP_SECRET: 'bAW5aAv1rj1NVA4-2eW2eeoB',
			callbackURL: "http://localhost:3003/auth/google/callback",
		},
		facebook: {
			APP_ID: '603952179792001',
			APP_SECRET: '5938865a2617c7d0ac520880fc23062b',
			callbackURL: "http://localhost:3003/auth/facebook/callback",
		}
	}
};