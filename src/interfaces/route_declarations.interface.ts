import { Router } from "express";

export interface IRouteDeclarations {
    path: string,
    routers: Router[]
}