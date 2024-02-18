export namespace main {
	
	export class DBConfig {
	    host: string;
	    port: string;
	    user: string;
	    password: string;
	    dbname: string;
	    sslmode: string;
	
	    static createFrom(source: any = {}) {
	        return new DBConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.host = source["host"];
	        this.port = source["port"];
	        this.user = source["user"];
	        this.password = source["password"];
	        this.dbname = source["dbname"];
	        this.sslmode = source["sslmode"];
	    }
	}

}

