// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {core} from '../models';
import {db} from '../models';

export function ConnectToDB(arg1:core.DBConfig):Promise<string>;

export function DefaultFetchTableData(arg1:string,arg2:number,arg3:number):Promise<core.TableData>;

export function ExportColumnDataType():Promise<db.ColumnData>;

export function FetchSchema(arg1:string):Promise<Array<db.TableColumn>>;

export function ListTables():Promise<core.Tables>;
