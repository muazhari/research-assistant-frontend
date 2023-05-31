import Request from "../Request.ts";
import LoginBody from "./LoginBody.ts";

export default class LoginRequest extends Request {

    body: LoginBody | undefined;
}
