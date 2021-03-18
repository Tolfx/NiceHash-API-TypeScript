import fs from "fs";

//@ts-ignore
export const Version: string = (JSON.parse(fs.readFileSync("./package.json"))).version;
export const API_Key: string = process.env.KEY_CODE ? process.env.KEY_CODE : "";
export const Secret_API_Key: string = process.env.API_SECRET_KEY ? process.env.API_SECRET_KEY : "";
export const API_Domain: string = process.env.API_DOMAIN ? process.env.API_DOMAIN : "";
export const Locale: string = process.env.LOCALE ? process.env.LOCALE : "";
export const Organization_ID: string = process.env.ORGANIZATION_ID ? process.env.ORGANIZATION_ID : "";
