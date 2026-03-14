import dns from 'dns';

const srvRecord = '_mongodb._tcp.cluster0.2fgdxiq.mongodb.net';

dns.resolveSrv(srvRecord, (err, addresses) => {
  if (err) {
    console.error('DNS Resolution Error:', err);
    return;
  }
  console.log('SRV Records found:', addresses);
});
