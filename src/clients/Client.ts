import {AxiosInstance} from "axios";
import Setting from "../settings/Setting.ts";

export default abstract class Client {
    abstract instance: AxiosInstance;

    abstract clientSetting: Setting;
}
