import Request from "../Request.ts";
import InputSetting from "./InputSetting.ts";


export default class QaRequest extends Request {
    accountId: string | undefined;
    inputSetting: InputSetting | undefined;

    constructor(accountId: string | undefined, inputSetting: InputSetting | undefined) {
        super()
        this.accountId = accountId;
        this.inputSetting = inputSetting;
    }
}