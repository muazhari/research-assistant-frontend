import Service from "./Service.ts";
import Client from "../clients/Client.ts";
import BackendOneClient from "../clients/BackendOneClient.ts";
import {AxiosResponse} from "axios";
import Content from "../models/value_objects/contracts/Content.ts";
import SearchRequest from "../models/value_objects/contracts/requests/passage_searchs/SearchRequest.ts";
import SearchResponse from "../models/value_objects/contracts/response/passage_searchs/SearchResponse.ts";

export default class PassageSearchService extends Service {
    client: Client;

    path: string;

    constructor() {
        super();
        this.client = new BackendOneClient();
        this.path = "/passage-search";
    }


    search(request: SearchRequest): Promise<AxiosResponse<Content<SearchResponse>>> {
        return this.client.instance.post(`${this.path}`, request);
    }


}