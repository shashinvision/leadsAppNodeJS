import query from "../services/db.js";
import { emptyOrRows } from "../helper.js";

const model = {
    getLeads: async (fromDate) => {
        const result = await query(
            "SELECT json_request FROM wp_bpamo_log_form WHERE created_at >  ? AND status_code <> '200' ORDER BY id DESC;",
            [fromDate + " 00:00:00"]
        );
        const data = emptyOrRows(result);
        // console.log("======Get Leads ====");
        // console.log(data);
        // console.log("Total: ", data.length);
        return data;
    },
};

export default model;
