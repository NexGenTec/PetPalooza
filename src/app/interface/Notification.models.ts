import { Data } from "@angular/router";

export interface Notificaccion {
    id: string;
    data?: Data;
    title: string;
    body: string;
}