module.exports = {
	"PKG"		: {},
	"ENV"		: "development",
	"VARS"	: {
		"ROLES"	: {
			"admin" : {
				"name"	: "admin",
				"pass"	: "upfront2011"
			}
		},
		"DB" : {
			"type"		: "couchDB",
			"address"	: "http://madsendev.iriscouch.com/",
			"name"		: "upfront_deckshare",
			"user"		: "deckshare",
			"pass"		: "upfront2011"
		},
		"PATH" : {
			"root"		: __dirname,
			"modules"	: __dirname + '/node_modules',
			"views"		: __dirname + '/views',
			"public"	: __dirname + '/public'
		}
	}
};