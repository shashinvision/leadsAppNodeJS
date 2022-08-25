import fetch from "node-fetch";
import model from "./models/leads.js";
import insertLead from "./controllers/Leads.js";
import fs from "fs";
import readline from "readline";
import colors from "colors";

const netInfo = async () => {
    await fetch("https://ifconfig.me/all.json")
        .then((res) => res.json())
        .then((text) => console.log("su IP: " + text.ip_addr));
};

const getAllLeads = async (date, time = "", valueJson = "") => {
    const data = await model.getLeads(date, time, valueJson);
    return data;
};
const setLeads = (leads) => {
    try {
        leads.forEach(async (element, index) => {
            await new Promise((resolve) => setTimeout(resolve, index++ * 1000));
            setTimeout(async () => {
                let resultInsert = await insertLead(element.json_request);
                if (
                    resultInsert["validation-errors"] != undefined ||
                    resultInsert.status != undefined
                ) {
                    totalProceso(
                        leads.length,
                        0,
                        1,
                        element.json_request,
                        resultInsert
                    );
                } else {
                    totalProceso(
                        leads.length,
                        1,
                        0,
                        element.json_request,
                        resultInsert
                    );
                }
            }, index++ * 100);
        });
        return true;
    } catch (error) {
        console.log("Error en el proceso: ", error);
        return false;
    }
};

let successCount = 0;
let errorCount = 0;
let dataLog = "";
const totalProceso = (leidos, success, errors, data, response) => {
    if (success > 0) {
        successCount++;
    }
    if (errors > 0) {
        errorCount++;
    }

    dataLog += "=== Lead Leido desde wordpress ===\n";
    dataLog += data;
    dataLog += "\n";
    dataLog += "Response desde AMO CRM:" + JSON.stringify(response) + "\n";
    dataLog += "===================================\n";
    if (
        response["validation-errors"] != undefined &&
        response["validation-errors"][0].errors.length > 0
    ) {
        dataLog += "*** Error *** : \n";
        dataLog +=
            JSON.stringify(response["validation-errors"][0].errors) +
            "\n".bgRed;
    } else {
        dataLog += "*** Success ***\n";
    }

    dataLog += "***** RESULTADOS ******\n";
    dataLog += "Leidos: " + leidos + "\n";
    dataLog += "Procesados success: " + successCount + "\n";
    dataLog += "Procesados errors: " + errorCount + "\n";
    dataLog += "***********************\n";

    console.log(dataLog);
    if (leidos == successCount + errorCount) {
        fileLog(dataLog);
    }
};
const fileLog = (data) => {
    var today = new Date();

    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    let hours = String(today.getHours());
    let minutes = String(today.getMinutes());
    let seconds = String(today.getSeconds());

    today =
        yyyy + "-" + mm + "-" + dd + "-" + hours + "" + minutes + "" + seconds;
    console.log("Guardando archivo de log...");
    let fileNameLog = "logs/" + today + "-log.txt";
    fs.writeFile(fileNameLog, data, (err) => {
        if (err) throw err;
        console.log("Log Guardado nombre del archivo: \n" + fileNameLog);
        console.log("Para salir preciona ENTER.");
    });
};

// para leer lineas de los inputs
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("=== BIENVENIDO ===");
await netInfo();
let dateAsk = "";
let hourAsk = "";
let valueAsk = "";
rl.question(
    `* ${
        "Obligatorio".bgRed.black
    }: Indique una fecha desde que se veran los leads \n FORMATO: AAAA-MM-DD: `,
    (answer) => {
        dateAsk = answer;
        console.log("Fecha desde seleccionada: ", dateAsk);
        rl.question(
            `* ${
                "Opcional".bgGreen.black
            }: indique la hora desde el día que seleccionó, puede dejarlo en blanco con ENTER \n FORMATO: HH:MM:SS: `,
            (answer) => {
                hourAsk = answer;
                console.log("Hora desde seleccionada", hourAsk);
                rl.question(
                    `* ${
                        "Opcional".bgGreen.black
                    }: Indique Value a buscar dentro del JSON, puede dejarlo en blanco con ENTER \n ejemplo, escribir: sede santiago es igual a la busqueda: value: Sede Santiago: `,
                    (answer) => {
                        valueAsk = answer;
                        console.log("valor a buscar seleccionado", valueAsk);

                        initProcess(dateAsk, hourAsk, valueAsk);
                    }
                );
            }
        );
    }
);

const initProcess = async (date, hours, search) => {
    console.log("date: " + date + "hours: " + hours + "search: " + search);
    console.log("Iniciando proceso de busqueda...");
    const leads = await getAllLeads(
        date.toString(),
        hours.toString(),
        search.toString()
    );
    if (leads.length > 0) {
        if (setLeads(leads)) {
            process.exit();
        }
    }
    console.log(
        "Cantidad de lead insuficientes:".bgYellow.black + " " + leads.length
    );

    process.exit();
};
