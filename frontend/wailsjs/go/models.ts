export namespace core {
	
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
	export class TableData {
	    table_data: db.ColumnData[][];
	
	    static createFrom(source: any = {}) {
	        return new TableData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.table_data = this.convertValues(source["table_data"], db.ColumnData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Tables {
	    table_names: string[];
	
	    static createFrom(source: any = {}) {
	        return new Tables(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.table_names = source["table_names"];
	    }
	}

}

export namespace db {
	
	export class ColumnData {
	    column_name: string;
	    value: any;
	
	    static createFrom(source: any = {}) {
	        return new ColumnData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.column_name = source["column_name"];
	        this.value = source["value"];
	    }
	}
	export class TableColumn {
	    columnName: string;
	    dataType: string;
	
	    static createFrom(source: any = {}) {
	        return new TableColumn(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.columnName = source["columnName"];
	        this.dataType = source["dataType"];
	    }
	}

}

