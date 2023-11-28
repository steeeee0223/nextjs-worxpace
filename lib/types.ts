import { Card, List, ROLE } from "@prisma/client";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };

export type Client = { role: ROLE; clientId: string };
