import запрос = require("supertest"); // костыль от "can only be default-imported using the 'esModuleInterop' flag"
import {пр} from "../../ист/индекс";
import {МодельВидаЧастицы} from "../../ист/модели/МодельВидаЧастицы";
import {МодельСозданияЧастицы} from "../../ист/модели/МодельСозданияЧастицы";
import {МодельОбновленияЧастицы} from "../../ист/модели/МодельОбновленияЧастицы";

describe("/частица", () => {
    function создЧаст(ид: number, название: string) {
        if(ид) return {ид: ид, название: название};
        else return {название: название};
    }

    const э = "Электрон",
        п = "Позитрон",
        ф = "Фотон",
        чэ = создЧаст(1, э),
        чп = создЧаст(1, п),
        чф = создЧаст(2, ф);
    
    beforeAll(async () => {
        await запрос(пр).delete("/__test__/данные");
    });
    
    it("должен вернуть 200 и пустой массив", async () => {
        await запрос(пр).get("/частицы").expect(200, []);
    });

    it("должен вернуть 404 для несуществующей частицы", async () => {
        await запрос(пр).get("/частицы/0").expect(404);
    });

    it("не должен создать частицу c неправильными входными данными", async () => {
        var част: МодельСозданияЧастицы = создЧаст(0, "    ");
        
        await запрос(пр).post("/частицы").expect(400);
        await запрос(пр).get("/частицы").expect(200, []);

        await запрос(пр).post("/частицы").send().expect(400);
        await запрос(пр).get("/частицы").expect(200, []);

        await запрос(пр).post("/частицы").send({название: 0}).expect(400);
        await запрос(пр).get("/частицы").expect(200, []);

        await запрос(пр).post("/частицы").send(част).expect(400);
        await запрос(пр).get("/частицы").expect(200, []);
    });

    it("должен создать частицы c правильными входными данными", async () => {
        var част: МодельСозданияЧастицы = создЧаст(0, п);

        await запрос(пр).post("/частицы").send(част).expect(201, чп);
        част = создЧаст(0, ф);
        await запрос(пр).post("/частицы").send(част).expect(201, чф);

        await запрос(пр).get("/частицы").expect(200, [чп, чф]);
    });

    it("должен вернуть 200 и созданные частицы", async () => {
        await запрос(пр).get("/частицы/1").expect(200, чп);
        await запрос(пр).get("/частицы/2").expect(200, чф);
    });

    it("не должен обновить частицу c неправильными входными данными", async () => {
        await запрос(пр).put("/частицы/1").expect(400);
        await запрос(пр).get("/частицы/1").expect(200, чп);

        await запрос(пр).put("/частицы/1").send().expect(400);
        await запрос(пр).get("/частицы/1").expect(200, чп);

        await запрос(пр).put("/частицы/1").send({название: 0}).expect(400);
        await запрос(пр).get("/частицы/1").expect(200, чп);

        await запрос(пр).put("/частицы/1").send({название: "    "}).expect(400);
        await запрос(пр).get("/частицы/1").expect(200, чп);
    });

    it("не должен обновить несуществующую частицу", async () => {
        const част: МодельОбновленияЧастицы = создЧаст(0, э);
        await запрос(пр).put("/частицы/0").send(част).expect(404);
    });

    it("должен обновить частицу c правильными входными данными", async () => {
        const част: МодельОбновленияЧастицы = создЧаст(0, э);
        await запрос(пр).put("/частицы/1").send(част).expect(204);
        await запрос(пр).get("/частицы/1").expect(200, чэ);
        await запрос(пр).get("/частицы/2").expect(200, чф);
    });

    it("не должен удалить несуществующую частицу", async () => {
        await запрос(пр).delete("/частицы/0").expect(404);
    });

    it("должен удалить существующие частицы", async () => {
        await запрос(пр).delete("/частицы/1").expect(204);
        await запрос(пр).delete("/частицы/2").expect(204);

        await запрос(пр).get("/частицы").expect(200, []);
    });
});
