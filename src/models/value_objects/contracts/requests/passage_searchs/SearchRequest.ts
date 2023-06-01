import Request from "../Request.ts";
import InputSetting from "./InputSetting.ts";
import OutputSetting from "./OutputSeting.ts";


export default class SearchRequest extends Request {
    accountId: string | undefined;
    inputSetting: InputSetting | undefined;
    outputSetting: OutputSetting | undefined;

    constructor(accountId: string | undefined, inputSetting: InputSetting | undefined, outputSetting: OutputSetting | undefined) {
        super()
        this.accountId = accountId;
        this.inputSetting = inputSetting;
        this.outputSetting = outputSetting;
    }
}