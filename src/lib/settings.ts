export const ITEM_PER_PAGE = 20

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/agent(.*)": ["agent"],
  "/list/contacts": ["admin", "agent"],
  "/list/events": ["admin", "agent"],
  "/list/organizations": ["admin", "agent"],
  "/list/products": ["admin", "agent"],
  "/list/reporting": ["admin", "agent"],
};