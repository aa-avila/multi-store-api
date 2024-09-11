export const sanitizePromotion = (doc: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, updatedAt, deleted, companyId, ...rest } = doc;
  return rest;
};
