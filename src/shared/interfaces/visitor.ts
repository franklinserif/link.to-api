export interface VisitorInformation {
  geo: {
    ip: any;
    location: string;
    country: string;
  };
  userAgent: {
    browser: string;
    os: UAParser.IOS;
  };
}
