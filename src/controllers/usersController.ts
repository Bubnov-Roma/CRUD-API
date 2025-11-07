import { IncomingMessage, ServerResponse } from "http";
import usersService from "../services/usersService";
import { isUserUpdateData, isValidUserData, isValidUUID } from "../utils/validation";

export class UsersController {
  async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const {method, url} = req;
    const urlParts =url?.split('/').filter(part => part) || [];

    try {
      if (urlParts[0] ==='api' && urlParts[1] === 'users') {
        if (method === 'GET' && urlParts.length === 2) {
          await this.getAllUsers(req, res);
        } else if (method === 'GET' && urlParts.length === 3){
          await this.getUserById(req, res, urlParts[2]);
        } else if (method === 'POST' && urlParts.length === 2) {
          await this.createUser(req, res);
        } else if (method === 'PUT' && urlParts.length === 3) {
          await this.updateUser(req, res, urlParts[2]);
        } else if (method === 'DELETE' && urlParts.length === 3) {
          await this.deleteUser(req, res, urlParts[2]);
        } else {
          this.sendResponse(res, 404, {message: 'Endpoint not found'});
        }
      } else {
          this.sendResponse(res, 404, {message: 'Endpoint not found'});
      }
    } catch (error) {
      console.error('Error handling request:', error);
    }
  }
  private async getAllUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const users = usersService.getAllUsers();
    this.sendResponse(res, 200, users);
  }
  private async getUserById(req: IncomingMessage, res: ServerResponse, id: string): Promise<void> {
    if (!isValidUUID) {
      this.sendResponse(res, 400, {message: 'Invalid user ID format'});
      return;
    }
    const user = usersService.getUserById(id);
    if (!user) {
      this.sendResponse(res, 404, {message: 'User not found'});
      return;
    }
    this.sendResponse(res, 200, user);
  }
  private async createUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const body = await this.parseRequestBody(req);
    if (!isValidUserData(body)) {
      this.sendResponse(res, 400, {
        message: 'Invalid user data. Required fields: username (string), age (number), hobbies (array of strings)' 
      });
      return;
    }
    const newUser= usersService.createUser(body);
    this.sendResponse(res, 201, newUser);
  }
  private async updateUser(req: IncomingMessage, res: ServerResponse, id: string): Promise<void> {
    if (!isValidUUID(id)) {
      this.sendResponse(res, 400, {message: 'Invalid user ID'});
      return;
    }
    const body = await this.parseRequestBody(req);
    if (!isUserUpdateData(body)) {
      this.sendResponse(res, 400, {
        message: 'Invalid update data. Allowed fields: username (string), age (number), hobbies (array of strings)' 
      });
      return;
    }
    const updatedUser = usersService.updateUser(id, body);
    if (!updatedUser) {
      this.sendResponse(res,404, {message: 'User notfound'});
      return;
    }
    this.sendResponse(res,200, updatedUser);
  }
  private async deleteUser(req: IncomingMessage, res: ServerResponse, id: string): Promise<void> {
    if (!isValidUUID(id)) {
      this.sendResponse(res,400, {message: 'Invalid user ID'});
      return;
    }
    const deleted = usersService.deleteUser(id);
    if (!deleted) {
      this.sendResponse(res, 404, {message: 'User not found'});
      return;
    }
    this.sendResponse(res, 204, null);
  }
  private async parseRequestBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(new Error('Invalid JSON'));
        }
      });
      req.on('error', reject)
    });
  }
  private sendResponse(res: ServerResponse, statusCode: number, data: any): void {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    if (statusCode === 204) {
      res.end();
    } else {
      res.end(JSON.stringify(data));
    }
  }
}