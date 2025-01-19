import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "purchases" model, go to https://mybudgetbear.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "zy6Xd8qyVo5i",
  fields: {
    category: {
      type: "belongsTo",
      parent: { model: "categories" },
      storageKey: "S2uP-pR84C52",
    },
    itemName: {
      type: "string",
      validations: { required: true },
      storageKey: "P7M9Mf9_sO6y",
    },
    quantity: { type: "number", storageKey: "Ad7e_u56udy7" },
    receiptId: {
      type: "string",
      validations: { unique: true },
      storageKey: "j-b2B6IyxqFu",
    },
    totalCost: {
      type: "number",
      validations: { required: true },
      storageKey: "ugj3S-LG3dDl",
    },
    unitPrice: { type: "number", storageKey: "FII3OhZOTwpw" },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "cCiSbQyEiuVC",
    },
  },
};
