import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "categories" model, go to https://mybudgetbear.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "grEKxle--1K-",
  fields: {
    color: { type: "string", storageKey: "VBfqpFOqEVeQ" },
    description: { type: "string", storageKey: "H-SNQQXU2CLH" },
    monthlyBudgetLimit: {
      type: "number",
      validations: { required: true },
      storageKey: "BgeZP9Hq2xQK",
    },
    name: {
      type: "string",
      validations: { required: true },
      storageKey: "2xi6042xt_v8",
    },
    parentCategoryId: { type: "string", storageKey: "Q2jwl3kRkbnk" },
    purchase: {
      type: "hasMany",
      children: { model: "purchases", belongsToField: "category" },
      storageKey: "-a6P089Dvlyw",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "wP8dK8CJud07",
    },
  },
};
