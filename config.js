module.exports = {
	secret: "ho.?decg2d5s+aea^k989i079t55$$@N>HJHH*",
	mongodb: {
		host: "ds019829.mlab.com",
		port: "19829",
		db: "react-redux-demo",
		adminUser: "grace",
		adminPW: "1qazXSW2"
	},
	ids : {
		github: {
			APP_ID: 'get_your_own',
			APP_SECRET: 'get_your_own',
			callbackURL: "http://127.0.0.1:3003/auth/github/callback",
		},
		google: {
			APP_ID: 'get_your_own',
			APP_SECRET: 'get_your_own',
			callbackURL: "http://localhost:3003/auth/google/callback",
		},
		facebook: {
			APP_ID: 'get_your_own',
			APP_SECRET: 'get_your_own',
			callbackURL: "http://localhost:3003/auth/facebook/callback",
		}
	}
};