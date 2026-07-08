module.exports = {
  apps: [
    {
      name: "bitcoin-info-zm",
      cwd: "/var/www/bitcoin-info-zm",
      script: "server.js",
      env: {
        BITCOIN_INFO_PORT: 3000,
        SATREWARD_URL: "http://127.0.0.1:30001",
      },
    },
    {
      name: "satreward",
      cwd: "/root/SatReward",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 30001,
      },
    },
  ],
};
