import Request from "../Request.ts";
import InputSetting from "./InputSetting.ts";


export default class QaRequest extends Request {
    accountId?: string;
    inputSetting?: InputSetting;

    constructor(accountId?: string, inputSetting?: InputSetting) {
        super()
        this.accountId = accountId;
        this.inputSetting = inputSetting;
    }
}
