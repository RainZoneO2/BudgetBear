import { Client } from "@gadget-client/getbudgetbear";

export const api = new Client({ environment: window.gadgetConfig.environment });
