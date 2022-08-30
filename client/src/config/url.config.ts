export const getSomeThingUrl = (slug: string) => `/coffee/${slug}`;

export const getAdminUrl = (url: string) => `/manage/${url}`;
export const getAdminHomeUrl = () => getAdminUrl('').slice(0, -1);
