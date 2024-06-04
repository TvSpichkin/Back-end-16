import экспресс, {Request, Response, Router} from "express";
import {типБД} from "../бд/бд";


export function полМаршТестов(бд: типБД): Router {
    const марш = экспресс.Router();

    марш.delete(encodeURI("/данные"), (запр: Request, отв: Response) => {
        бд.частицы = [];

        отв.sendStatus(204);
    });

    return марш;
}
