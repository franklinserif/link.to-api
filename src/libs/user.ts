import { Request } from 'express';
import * as UAParser from 'ua-parser-js';

function getIp(req: Request) {
  return (
    req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
  );
}

function getUserAgentInformation(req: Request) {
  const userAgent = req.headers['user-agent'];

  const parser = new UAParser();

  return parser.setUA(userAgent).getResult();
}

export function getUserInformation(req: Request) {
  return {
    ip: getIp(req),
    userAgent: getUserAgentInformation(req),
  };
}
