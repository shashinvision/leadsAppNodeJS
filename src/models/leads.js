import query from "../services/db.js";
import { emptyOrRows } from "../helper.js";

const model = {
    getLeads: async (fromDate, hours = "", valueJson = "") => {
        const dateTimeQuery =
            fromDate + " " + (hours == "" ? "00:00:00" : hours);

        let queryLeads = `
            SELECT json_request
            FROM wp_bpamo_log_form
            WHERE created_at >  ?
                AND status_code <> '200'
            ORDER BY id DESC;
            `;

        if (valueJson != "") {
            queryLeads = `
            SELECT json_request
            FROM wp_bpamo_log_form
            WHERE created_at >  ?
                AND status_code <> '200'
                AND LOWER(json_request) like  LOWER('%"value": "${valueJson.trim()}"%')
            ORDER BY id DESC;
            `;
        }
        const result = await query(queryLeads, [dateTimeQuery.trim()]);

        const data = await emptyOrRows(result);
        // console.log("======Get Leads ====");
        // console.log(data);
        // console.log("Total: ", data.length);
        return data;
    },
};

export default model;
