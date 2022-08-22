import fetch from "node-fetch";
import model from "./models/leads.js";
import insertLead from "./controllers/Leads.js";
import fs from "fs";

const netInfo = async () => {
    await fetch("https://ifconfig.me/all.json")
        .then((res) => res.json())
        .then((text) => console.log("su IP: " + text.ip_addr));
};

const getAllLeads = async (date) => {
    const data = await model.getLeads(date);
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

console.log("=== BIENVENIDO ===");
await netInfo();
console.log("Indique una fecha desde que se veran los leads");
console.log("FORMATO: AAAA-MM-DD: ");

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
            JSON.stringify(response["validation-errors"][0].errors) + "\n";
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

process.stdin.on("data", async (data) => {
    const leads = await getAllLeads(data.toString());
    if (setLeads(leads)) {
        end();
        return;
    }
    console.log("ERROR al procesar los leads");
    end();
});

const end = () => {
    process.stdin.on("data", async (data) => {
        process.exit();
    });
};
