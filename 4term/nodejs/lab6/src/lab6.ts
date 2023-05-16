import * as dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import * as query from "./queries";

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
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
run(query.getVideosByName("Stephanie Bulger"));
run(query.getChannelSubscribersById("79f6ce8f-ee0c-4ef5-9c36-da06b7f4cb76"));
run(query.getTopRatedVideosAfterDate(10, "2021-09-01"));
run(query.getSubscribedChannelsSortedByLevel("Ennis Haestier"));
