import request from "request-promise-native";
import { Currency as Currency } from "../interfaces/types/Currency";
import APIError from "../interfaces/APIError";
import { BalanceOnCurrency, DepositAdress, AccountWithdraws } from "../interfaces/Accounting";
import { ActiverWorkers } from "../interfaces/Miner"
import { API_Key, Secret_API_Key, API_Domain, Locale, Organization_ID } from "../Config"
//@ts-ignore
import CryptoJS from 'crypto-js'
import qs from 'qs'

// Found on https://github.com/nicehash/rest-clients-demo/blob/master/javascript/api.js
// Thanks <3

interface Options { 
    body?: object;
    query?: object;
    time?: object
}
class Api {

    private host;
    private locale;
    private key;
    private secret;
    private org;
    private localTimeDiff: any;
    private time: any;

	constructor(locale: string, apiHost: string, apiKey: string, apiSecret: string, orgId: string) {
		this.locale = locale || 'en';
		this.host = apiHost;
		this.key = apiKey;
		this.secret = apiSecret;
		this.org = orgId;
		this.localTimeDiff = null;
	}

    private createNonce(): string {
        var s = '', length = 32;
        do {
            s += Math.random().toString(36).substr(2);
        } while (s.length < length);
        s = s.substr(0, length);
        return s;
    }

    // Dunno how this really works tbh.
    private getAuthHeader = (
            apiKey: string, 
            apiSecret: string, 
            time: any, 
            nonce: string, 
            organizationId: string = '', 
            request: {body: any, path: any, method: any, query: any}
        ) => {
        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, apiSecret);
        hmac.update(apiKey);
        hmac.update("\0");
        hmac.update(time);
        hmac.update("\0");
        hmac.update(nonce);
        hmac.update("\0");
        hmac.update("\0");
        if (organizationId) hmac.update(organizationId);
        hmac.update("\0");
        hmac.update("\0");
        hmac.update(request.method);
        hmac.update("\0");
        hmac.update(request.path);
        hmac.update("\0");
        if (request.query) hmac.update(typeof request.query == 'object' ? qs.stringify(request.query) : request.query);
        if (request.body) {
            hmac.update("\0");
            hmac.update(typeof request.body == 'object' ? JSON.stringify(request.body) : request.body);
        }
    
        return apiKey + ':' + hmac.finalize().toString(CryptoJS.enc.Hex);
    };

	async getTime() {
		return request({
			uri: this.host + '/api/v2/time',
			json: true
		})
			.then(res => {
				this.localTimeDiff = res.serverTime - (+new Date());
				this.time = res.serverTime;
				return res;
			});
	}

	private apiCall(method: string, path: string, {query, body, time}: any): any {
        return new Promise(async (resolve, reject) => {
            if(this.localTimeDiff === null) {
                reject(new Error('Get server time first .getTime()'));
            }

            var [pathOnly,pathQuery] = path.split('?');
            if(pathQuery) query = {...qs.parse(pathQuery), ...query};

            const nonce = this.createNonce();
            const timestamp = (time || (+new Date() + this.localTimeDiff)).toString();
            const options = {
                uri: this.host + pathOnly,
                method: method,
                headers: {
                    'X-Request-Id': nonce,
                    'X-User-Agent': 'NHNodeClient',
                    'X-Time': timestamp,
                    'X-Nonce': nonce,
                    'X-User-Lang': this.locale,
                    'X-Organization-Id': this.org,
                    'X-Auth': this.getAuthHeader(this.key, this.secret, timestamp, nonce, this.org, {
                        method,
                        path: pathOnly,
                        query,
                        body,
                    })
                },
                qs: query,
                body,
                json: true
            }
            let r = await request(options).catch(e => reject(e.error))
            resolve(r);
        })
	}

	async get(path: string, options?: Options): Promise<any>  {
        return new Promise(async (resolve, reject) => {
            let call = await this.apiCall('GET', path, options).catch((e: APIError) => reject(e));
            resolve(call)
        });
	}

	async post(path: string, options?: Options): Promise<any>  {
        return new Promise(async (resolve, reject) => {
            let call = await this.apiCall('POST', path, options).catch((e: APIError) => reject(e));
            resolve(call)
        });
	}

	async put(path: string, options?: Options): Promise<any>  {
        return new Promise(async (resolve, reject) => {
            let call = await this.apiCall('PUT', path, options).catch((e: APIError) => reject(e));
            resolve(call)
        });
	}

	async delete(path: string, options?: Options): Promise<any>  {
        return new Promise(async (resolve, reject) => {
            let call = await this.apiCall('DELETE', path, options).catch((e: APIError) => reject(e));
            resolve(call)
        });
	}

}

let api = new Api(Locale, API_Domain, API_Key, Secret_API_Key, Organization_ID);

export async function Account2Balance(currency: Currency): Promise<BalanceOnCurrency>
{
    return new Promise(async (resolve, reject) => {
        const endpoint: string = "/main/api/v2/accounting/account2/";
        await api.getTime();
        let result: BalanceOnCurrency = await api.get(`${endpoint}${currency}`, {}).catch((e: APIError) => reject(e));
        resolve(result);
    });
}

export async function AccountDepositAddress(currency: Currency): Promise<DepositAdress>
{
    return new Promise(async (resolve, reject) => {
        const endpoint: string = "/main/api/v2/accounting/depositAddresses";
        await api.getTime();
        let result: DepositAdress = await api.get(`${endpoint}?currency=${currency}`, {}).catch((e: APIError) => reject(e));
        resolve(result);
    });
}

export async function GetCurrentActiveWorkers(): Promise<ActiverWorkers>
{
    return new Promise(async (resolve, reject) => {
        const endpoint: string = "/main/api/v2/mining/rigs/activeWorkers";
        await api.getTime();
        let result: ActiverWorkers = await api.get(`${endpoint}`, {}).catch((e: APIError) => reject(e));
        resolve(result);
    });
}

export async function AccountWithdraw(currency: Currency, amount: number, addressId: string): Promise<AccountWithdraws>
{
    return new Promise(async (resolve, reject) => {
        const endpoint: string = "/main/api/v2/accounting/withdrawal";
        await api.getTime();
        let result: AccountWithdraws = await api.post(`${endpoint}`, {
            body: {
                currency,
                amount,
                withdrawalAddressId: addressId
            }
        }).catch((e: APIError) => reject(e));

        resolve(result);
    });
}
