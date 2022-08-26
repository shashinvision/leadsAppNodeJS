import fetch from "node-fetch";
import "dotenv/config";

const urlAMO = process.env.AMO_URL;

const insertLead = async (data, accessToken) => {
    let respuesta = "";
    await fetch(urlAMO, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: data,
    })
        .then((res) => {
            return res.json();
        })
        .then((response) => {
            respuesta = response;
        })
        .catch(function (err) {
            console.error("Error durante el proceso: ", err);
        });
    return respuesta;
};
export default insertLead;
