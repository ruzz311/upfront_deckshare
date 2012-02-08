var cfg = { host: ""
          , port: ""
          , ssl:  true
          , proxy: ""
          , user: ""
          , pass: ""
          };

cfg.credentials = function credentials() {
  if (cfg.user && cfg.pass) {
    return cfg.user + ":" + cfg.pass + "@";
  }
  else { return ""; }
}();

cfg.url = function () {
  return "http" + (cfg.ssl ? "s" : "") + "://" + cfg.credentials + cfg.host + 
    ":" + cfg.port;
}();

module.exports = exports = cfg;
