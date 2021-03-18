import { Currency as Currency } from "./types/Currency";

export interface BalanceOnCurrency
{
    active: boolean,
    currency: Currency,
    totalBalance: string,
    available: string
    pending: string,
    pendingDetails?: {
        deposit: object;
        withdrawal: object;
        exchange: object;
        hashpowerOrders: object;
        unpaidMining: object;
    }
    btcRate: number
}

export interface DepositAdress {
    list: [
        {
          type: object,
          address: string,
          currency: Currency
        }
    ]
}