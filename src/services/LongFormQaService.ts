import Service from "./Service.ts";
import Client from "../clients/Client.ts";
import BackendOneClient from "../clients/BackendOneClient.ts";
import {AxiosResponse} from "axios";
import Content from "../models/value_objects/contracts/Content.ts";
import QaRequest from "../models/value_objects/contracts/requests/long_form_qas/QaRequest.ts";
import QaResponse from "../models/value_objects/contracts/response/long_form_qas/QaResponse.ts";

export default class LongFormQaService extends Service {
    client: Client;

    path: string;

    constructor() {
        super();
        this.client = new BackendOneClient();
        this.path = "/long-form-qa";
    }


    qa(request: QaRequest): Promise<AxiosResponse<Content<QaResponse>>> {
        return this.client.instance.post(`${this.path}`, request);
    }


}