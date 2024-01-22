import Service from "./Service.ts";
import Client from "../clients/Client.ts";
import BackendOneClient from "../clients/BackendOneClient.ts";
import CreateOneRequest from "../models/value_objects/contracts/requests/managements/accounts/CreateOneRequest.ts";
import DeleteOneByIdRequest
    from "../models/value_objects/contracts/requests/managements/accounts/DeleteOneByIdRequest.ts";
import {AxiosResponse} from "axios";
import ReadOneByIdRequest from "../models/value_objects/contracts/requests/managements/accounts/ReadOneByIdRequest.ts";
import PatchOneByIdRequest from "../models/value_objects/contracts/requests/managements/accounts/PatchOneById.ts";
import Account from "../models/entities/Account.ts";
import Content from "../models/value_objects/contracts/Content.ts";

export default class AccountService extends Service {
    client: Client;

    path: string;

    constructor() {
        super();
        this.client = new BackendOneClient();
        this.path = "/accounts";
    }


    createOne(request: CreateOneRequest): Promise<AxiosResponse<Content<Account>>> {
        return this.client.instance.post(`${this.path}`, request.body);
    }

    deleteOneById(request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
        return this.client.instance.delete(`${this.path}/${request.id}`);
    }

    readAll(): Promise<AxiosResponse<Content<Account[]>>> {
        return this.client.instance.get(`${this.path}`);
    }

    readOneById(request: ReadOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
        return this.client.instance.get(`${this.path}/${request.id}`);
    }

    patchOneById(request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Account>>> {
        return this.client.instance.patch(`${this.path}/${request.id}`, request.body);
    }

}
