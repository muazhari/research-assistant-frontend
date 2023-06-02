import Request from "../Request.ts";
import RegisterBody from "./RegisterBody.ts";

export default class RegisterRequest extends Request {

    body: RegisterBody | undefined;
}
