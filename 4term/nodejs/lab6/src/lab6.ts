import { Pool } from "pg";
import * as query from "./queries";

const pool = new Pool({
    user: "knysh",
    host: "localhost",
    database: "nodejs-lab6",
    password: "",
    port: 5432,
});

function run(q: string) {
    pool.query(q, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(res.rows);
    });
}

run(query.getUserChannelsSortedByCreationDate());
run(query.getTopLikedVideos());
run(query.getVideosByStephanieBulger());
run(query.getChannelSubscribersById());
run(query.getTopRatedVideosAfterDate());
