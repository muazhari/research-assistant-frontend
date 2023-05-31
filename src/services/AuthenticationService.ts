import Service from "./Service.ts";
import Client from "../clients/Client.ts";
import Content from "../models/value_objects/contracts/Content.ts";
import LoginRequest from "../models/value_objects/contracts/requests/authentications/LoginRequest.ts";
import RegisterRequest from "../models/value_objects/contracts/requests/authentications/RegisterRequest.ts";
import LoginResponse from "../models/value_objects/contracts/response/authentications/LoginResponse.ts";
import RegisterResponse from "../models/value_objects/contracts/response/authentications/RegisterResponse.ts";
import BackendOneClient from "../clients/BackendOneClient.ts";
import {AxiosResponse} from "axios";

export default class AuthenticationService extends Service {
    client: Client;

    path: string;

    constructor() {
        super();
        this.client = new BackendOneClient();
        this.path = "/authentications";
    }


    login(request: LoginRequest): Promise<AxiosResponse<Content<LoginResponse>>> {
        return this.client.instance.post(`${this.path}/logins/email-and-password`, request.body);
    }


    register(request: RegisterRequest): Promise<AxiosResponse<Content<RegisterResponse>>> {
        return this.client.instance.post(`${this.path}/logins/email-and-password`, request.body);
    }


}