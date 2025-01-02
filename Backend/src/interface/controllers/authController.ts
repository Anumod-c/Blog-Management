import { Request, response, Response } from "express";
import { AuthService } from "../../app/useCases/auth";
import jwt from "jsonwebtoken";
import config from "../../infrastructure/config/config";
class AUthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
  //verifying no user exist, creating a tempUser and sending email for verification
  register = async (req: Request, res: Response) => {
    try {
      const user = req.body;
      console.log(user, "in cntorller");
      const response = await this.authService.register(user);
      if (response.success) {
        res.status(200).json({ message: response.message, success: true });
      } else {
        console.log("else in controller");
        res.json({ message: response.message, success: false });
      }
      console.log(user, "in cntorller222");
    } catch (error) {
      console.log("Error in registeration in controller", error);
      res
        .status(500)
        .json({
          message: "An unexpected error occured. Please try again later.",
        });
    }
  };
  //verify the tempUser, create new user and deleting tempUser
  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const response = await this.authService.verifyEmail(email);
      if (response.success) {
        res.status(200).json({ message: response.message, success: true });
      } else {
        res.json({ message: response.message, success: false });
      }
    } catch (error) {
      console.log("Error in verify email controller:", error);
      res
        .status(500)
        .json({
          message: "An unexpected error occurred. Please try again later.",
          success: false,
        });
    }
  };
  email = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const result = await this.authService.login(data);
      if (result.success) {
        res
          .status(200)
          .json({
            message: result.message,
            user: result.userData,
            token: result.token,
            success: true,
          });
      } else {
        res.json({ message: result.message, success: false });
      }
    } catch (error) {
      console.log("Error inn loginig", error);
      res.status(500).json({ message: "Login unsuccessfull", success: false });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      console.log('refresh token')
      const { refreshToken } = req.body;
      console.log(refreshToken, "ref token");
      if (!refreshToken) {
        res.status(403).json({ message: "Refresh token not valid" });
        return;
      }

      jwt.verify(refreshToken, config.JWT_SECRET || "", (err: any, user: any) => {
        if (err) {
          res.status(403).json({ message: "Forbidden" });
          return;
        }

        console.log(err, "-----------", user);
        console.log("refresh token");
        const accessToken = jwt.sign(
          { id: user.id, email: user.email },
          config?.JWT_SECRET || "",
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      });
    } catch (error) {}
  };
}

export const authController = new AUthController();
