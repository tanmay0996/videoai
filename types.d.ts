import { Connection } from "mongoose";


declare global{
    var mongoose:{
        conn: Connection | null;
        promise: Promise<Connection> | null;  // kese type a promise , Connection type ka promise

    }
}

export {}