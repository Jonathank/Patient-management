import express,{ Application, Request,Response} from "express";
import ip from "ip";
import cors from 'cors';
import { Code } from "./enum/Code.enum";
import { HttpResponse } from "./domain/Response";
import { Status } from "./enum/Status.enum";
import patientRoutes from "./routes/Patient.routes";

export class App{
    private readonly app: Application;
    private readonly APPLICATION_RUNNING = 'application is running on : ';
    private readonly ROUTE_NOT_FOUND = 'Route does not exist on the server';

    constructor(private readonly port:(string | number) = process.env.SERVER_PORT || 3000){
        this.app = express();
        this.middleware();
        this.routes();
    }

    listen(): void{
        this.app.listen(this.port);
        console.log(`${this.APPLICATION_RUNNING} ${ip.address()}:${this.port}`);
    }

    private middleware():void {
        this.app.use(cors({origin: '*'}));
        this.app.use(express.json());
    }

    private routes():void {
     this.app.use('/patients', patientRoutes);
     this.app.get('/', (req : Request, res:Response) => {
        res.status(Code.OK).send(new HttpResponse( Code.OK,Status.OK,'WELCOME TO PATIENTS MIS'))});

     this.app.all('*', (req:Request, res:Response) => {
        res.status(Code.NOT_FOUND).send(new HttpResponse( Code.NOT_FOUND,Status.NOT_FOUND,this.ROUTE_NOT_FOUND))});
    } 
}



