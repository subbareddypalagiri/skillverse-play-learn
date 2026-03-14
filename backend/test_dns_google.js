import dns from 'dns';

dns.setServers(['8.8.8.8']);

const srvRecord = '_mongodb._tcp.cluster0.2fgdxiq.mongodb.net';

console.log('Querying SRV record using 8.8.8.8...');

dns.resolveSrv(srvRecord, (err, addresses) => {
  if (err) {
    console.error('DNS Resolution Error (8.8.8.8):', err);
    return;
  }
  console.log('SRV Records found (8.8.8.8):', addresses);
});
