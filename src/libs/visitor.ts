import { Request } from 'express';
import * as UAParser from 'ua-parser-js';
import axios from 'axios';
import { IPAPI_HOST } from '@shared/constants/ipapi';
import { IpapiResponse } from '@shared/interfaces/ipapi';
import { VisitorInformation } from '@shared/interfaces/visitor';
import { ErrorManager } from '@shared/exceptions/ExceptionManager';

function getIp(req: Request) {
  return (
    req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
  );
}

async function getGeo(req: Request) {
  const ethernetProtocolDir = getIp(req);

  let ip: any =
    ethernetProtocolDir === '::1' ? '38.171.85.131' : ethernetProtocolDir;

  try {
    const geoLocationInformation = await axios.get<IpapiResponse>(
      `${IPAPI_HOST}/${ip}/json`,
    );

    ip = Array.isArray(ip) ? ip.join('') : ip;

    return {
      ip: ip,
      location: geoLocationInformation.data.city,
      country: geoLocationInformation.data.country_name,
    };
  } catch (error) {
    throw new ErrorManager(error);
  }
}

function getUserAgentInformation(req: Request) {
  const userAgent = req.headers['user-agent'];

  const parser = new UAParser();

  const visitor = parser.setUA(userAgent).getResult();

  return {
    browser: visitor.browser.name,
    os: visitor.os,
  };
}

export async function getVisitorInformation(
  req: Request,
): Promise<VisitorInformation> {
  const geo = await getGeo(req);
  const userAgent = await getUserAgentInformation(req);

  return {
    ...geo,
    ...userAgent,
  };
}
