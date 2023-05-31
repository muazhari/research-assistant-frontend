import Service from "./Service.ts";
import Client from "../clients/Client.ts";
import BackendOneClient from "../clients/BackendOneClient.ts";
import CreateOneRequest
    from "../models/value_objects/contracts/requests/managements/document_types/CreateOneRequest.ts";
import DeleteOneByIdRequest
    from "../models/value_objects/contracts/requests/managements/document_types/DeleteOneByIdRequest.ts";
import {AxiosResponse} from "axios";
import ReadOneByIdRequest
    from "../models/value_objects/contracts/requests/managements/document_types/ReadOneByIdRequest.ts";
import PatchOneByIdRequest from "../models/value_objects/contracts/requests/managements/document_types/PatchOneById.ts";
import DocumentType from "../models/entities/DocumentType.ts";
import Content from "../models/value_objects/contracts/Content.ts";

export default class DocumentTypeService extends Service {
    client: Client;

    path: string;

    constructor() {
        super();
        this.client = new BackendOneClient();
        this.path = "/document-types";
    }


    createOne(request: CreateOneRequest): Promise<AxiosResponse<Content<DocumentType>>> {
        return this.client.instance.post(`${this.path}`, request.body);
    }

    deleteOneById(request: DeleteOneByIdRequest): Promise<AxiosResponse<Content<DocumentType>>> {
        return this.client.instance.delete(`${this.path}/${request.id}`);
    }

    readAll(): Promise<AxiosResponse<Content<DocumentType[]>>> {
        return this.client.instance.get(`${this.path}`);
    }

    readOneById(request: ReadOneByIdRequest): Promise<AxiosResponse<Content<DocumentType>>> {
        return this.client.instance.get(`${this.path}/${request.id}`);
    }

    patchOneById(request: PatchOneByIdRequest): Promise<AxiosResponse<Content<DocumentType>>> {
        return this.client.instance.patch(`${this.path}/${request.id}`, request.body);
    }

}