import Service from "./Service.ts";
import Client from "../clients/Client.ts";
import BackendOneClient from "../clients/BackendOneClient.ts";
import CreateOneRequest from "../models/value_objects/contracts/requests/managements/documents/CreateOneRequest.ts";
import DeleteOneByIdRequest
    from "../models/value_objects/contracts/requests/managements/documents/DeleteOneByIdRequest.ts";
import {AxiosResponse} from "axios";
import ReadOneByIdRequest from "../models/value_objects/contracts/requests/managements/documents/ReadOneByIdRequest.ts";
import PatchOneByIdRequest from "../models/value_objects/contracts/requests/managements/documents/PatchOneById.ts";
import Document from "../models/entities/Document.ts";
import Content from "../models/value_objects/contracts/Content.ts";
import ReadAllByAccountIdRequest
    from "../models/value_objects/contracts/requests/managements/accounts/ReadAllByAccountIdRequest.ts";

export default class DocumentService extends Service {
    client: Client;

    path: string;

    constructor() {
        super();
        this.client = new BackendOneClient();
        this.path = "/documents";
    }


    createOne(request: CreateOneRequest): Promise<AxiosResponse<Content<Document>>> {
        return this.client.instance.post(`${this.path}`, request.body);
    }

    deleteOneById(request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<Document>>> {
        return this.client.instance.delete(`${this.path}/${request.id}`);
    }

    readAll(): Promise<AxiosResponse<Content<Document[]>>> {
        return this.client.instance.get(`${this.path}`);
    }

    readAllByAccountId(request: ReadAllByAccountIdRequest): Promise<AxiosResponse<Content<Document[]>>> {
        return this.client.instance.get(`${this.path}?account_id=${request.accountId}`);
    }

    readOneById(request: ReadOneByIdRequest): Promise<AxiosResponse<Content<Document>>> {
        return this.client.instance.get(`${this.path}/${request.id}`);
    }

    patchOneById(request: PatchOneByIdRequest): Promise<AxiosResponse<Content<Document>>> {
        return this.client.instance.patch(`${this.path}/${request.id}`, request.body);
    }

}